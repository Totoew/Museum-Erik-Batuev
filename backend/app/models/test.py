from sqlalchemy import String, Text, Integer, Boolean, DateTime, ForeignKey, JSON, func, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from ..core.database import Base


class Test(Base):
    __tablename__ = "tests"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    difficulty: Mapped[str] = mapped_column(String(20), default="medium")
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    ai_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    source_article_id: Mapped[int | None] = mapped_column(ForeignKey("articles.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    questions = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    results = relationship("TestResult", back_populates="test", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id"), index=True)
    text: Mapped[str] = mapped_column(Text)
    options: Mapped[list] = mapped_column(JSON)  # ["вариант1", "вариант2", ...]
    correct_index: Mapped[int] = mapped_column(Integer)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0)

    test = relationship("Test", back_populates="questions")


class TestResult(Base):
    __tablename__ = "test_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    score: Mapped[float] = mapped_column(Float)  # 0.0 – 1.0
    answers: Mapped[list] = mapped_column(JSON)
    completed_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    test = relationship("Test", back_populates="results")
    user = relationship("User", back_populates="test_results")
