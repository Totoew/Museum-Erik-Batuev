from pydantic import BaseModel
from datetime import datetime


class QuestionCreate(BaseModel):
    text: str
    options: list[str]
    correct_index: int
    explanation: str | None = None
    order: int = 0


class QuestionOut(BaseModel):
    id: int
    text: str
    options: list[str]
    order: int

    model_config = {"from_attributes": True}


class QuestionWithAnswer(QuestionOut):
    correct_index: int
    explanation: str | None


class TestCreate(BaseModel):
    title: str
    description: str | None = None
    difficulty: str = "medium"
    questions: list[QuestionCreate]


class TestOut(BaseModel):
    id: int
    title: str
    description: str | None
    difficulty: str
    questions_count: int = 0
    completions: int = 0
    ai_generated: bool
    is_published: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TestSubmit(BaseModel):
    answers: list[int]


class TestResultOut(BaseModel):
    score: float
    correct: int
    total: int
    answers: list[int]
    completed_at: datetime

    model_config = {"from_attributes": True}


class AITestGenerateRequest(BaseModel):
    article_id: int
    questions_count: int = 10
    difficulty: str = "medium"
