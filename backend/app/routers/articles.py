from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from ..core.database import get_db
from ..models.article import Article
from ..models.comment import Comment
from ..schemas.article import ArticleCreate, ArticleUpdate, ArticleOut

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("/", response_model=list[ArticleOut])
async def list_articles(
    section: str | None = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Article).where(Article.is_published == True)
    if section:
        query = query.where(Article.section == section)
    query = query.offset((page - 1) * per_page).limit(per_page).order_by(Article.created_at.desc())

    result = await db.execute(query)
    articles = result.scalars().all()

    # Добавляем количество комментариев
    out = []
    for a in articles:
        count = await db.scalar(select(func.count()).where(Comment.article_id == a.id, Comment.is_approved == True))
        item = ArticleOut.model_validate(a)
        item.comments_count = count or 0
        out.append(item)
    return out


@router.get("/{article_id}", response_model=ArticleOut)
async def get_article(article_id: int, db: AsyncSession = Depends(get_db)):
    article = await db.get(Article, article_id)
    if not article or not article.is_published:
        raise HTTPException(status_code=404, detail="Статья не найдена")
    count = await db.scalar(
        select(func.count()).where(Comment.article_id == article_id, Comment.is_approved == True)
    )
    out = ArticleOut.model_validate(article)
    out.comments_count = count or 0
    return out


@router.post("/{article_id}/like", status_code=status.HTTP_200_OK)
async def like_article(article_id: int, db: AsyncSession = Depends(get_db)):
    article = await db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Статья не найдена")
    article.likes_count += 1
    await db.commit()
    return {"likes_count": article.likes_count}
