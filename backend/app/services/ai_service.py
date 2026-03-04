"""
ИИ-сервис для генерации тестов на основе текстов статей.
Использует OpenAI GPT или Yandex GPT (конфигурируется через .env).
"""
import json
import asyncio
from ..core.config import settings


async def generate_test_questions(
    article_id: int,
    content: str,
    questions_count: int = 10,
    difficulty: str = "medium",
) -> list[dict]:
    """
    Генерирует вопросы с вариантами ответов на основе текста статьи.
    Сохраняет результат в БД (TODO: добавить сессию БД).
    """
    if not settings.openai_api_key:
        print(f"[AI] OpenAI API key not configured. Skipping generation for article {article_id}.")
        return []

    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=settings.openai_api_key)

        difficulty_desc = {
            "easy": "простые вопросы на понимание основных фактов",
            "medium": "вопросы среднего уровня, требующие внимательного прочтения",
            "hard": "сложные вопросы на анализ и синтез информации",
        }.get(difficulty, "вопросы среднего уровня")

        prompt = f"""На основе следующего текста создай {questions_count} тестовых вопросов ({difficulty_desc}).
Каждый вопрос должен иметь 4 варианта ответа, один из которых правильный.

Верни ответ строго в формате JSON:
{{
  "questions": [
    {{
      "text": "Вопрос",
      "options": ["Вариант А", "Вариант Б", "Вариант В", "Вариант Г"],
      "correct_index": 0,
      "explanation": "Краткое пояснение правильного ответа"
    }}
  ]
}}

Текст статьи:
{content[:3000]}"""

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
        )

        data = json.loads(response.choices[0].message.content)
        questions = data.get("questions", [])
        print(f"[AI] Generated {len(questions)} questions for article {article_id}")
        return questions

    except Exception as e:
        print(f"[AI] Error generating questions: {e}")
        return []
