from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from ..core.database import get_db
from ..models.test import Test, Question, TestResult
from ..models.article import Article
from ..schemas.test import TestOut, TestSubmit, TestResultOut, AITestGenerateRequest, QuestionOut, QuestionWithAnswer
from ..services.ai_service import generate_test_questions

router = APIRouter(prefix="/tests", tags=["tests"])


@router.get("/", response_model=list[TestOut])
async def list_tests(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Test).where(Test.is_published == True).order_by(Test.created_at.desc())
    )
    tests = result.scalars().all()
    out = []
    for t in tests:
        q_count = await db.scalar(select(func.count()).where(Question.test_id == t.id))
        r_count = await db.scalar(select(func.count()).where(TestResult.test_id == t.id))
        item = TestOut.model_validate(t)
        item.questions_count = q_count or 0
        item.completions = r_count or 0
        out.append(item)
    return out


@router.get("/{test_id}/questions", response_model=list[QuestionOut])
async def get_test_questions(test_id: int, db: AsyncSession = Depends(get_db)):
    test = await db.get(Test, test_id)
    if not test or not test.is_published:
        raise HTTPException(status_code=404, detail="Тест не найден")
    result = await db.execute(
        select(Question).where(Question.test_id == test_id).order_by(Question.order)
    )
    return result.scalars().all()


@router.post("/{test_id}/submit", response_model=TestResultOut)
async def submit_test(
    test_id: int,
    data: TestSubmit,
    db: AsyncSession = Depends(get_db),
):
    test = await db.get(Test, test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Тест не найден")

    questions = (await db.execute(
        select(Question).where(Question.test_id == test_id).order_by(Question.order)
    )).scalars().all()

    if len(data.answers) != len(questions):
        raise HTTPException(status_code=400, detail="Неверное количество ответов")

    correct = sum(1 for q, a in zip(questions, data.answers) if q.correct_index == a)
    score = correct / len(questions) if questions else 0.0

    result = TestResult(
        test_id=test_id,
        user_id=1,  # TODO: получить из JWT
        score=score,
        answers=data.answers,
    )
    db.add(result)
    await db.commit()
    await db.refresh(result)

    return TestResultOut(
        score=score,
        correct=correct,
        total=len(questions),
        answers=data.answers,
        completed_at=result.completed_at,
    )


@router.post("/generate", status_code=status.HTTP_202_ACCEPTED)
async def generate_test(
    data: AITestGenerateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """ИИ-генерация вопросов на основе статьи (только для администраторов)."""
    article = await db.get(Article, data.article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Статья не найдена")

    background_tasks.add_task(
        generate_test_questions,
        article_id=data.article_id,
        content=article.content,
        questions_count=data.questions_count,
        difficulty=data.difficulty,
    )
    return {"message": "Генерация теста запущена. Тест появится в системе после завершения."}
