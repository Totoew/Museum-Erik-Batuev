from sqlalchemy import String, Enum as SAEnum, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from enum import Enum
from ..core.database import Base


class UserRole(str, Enum):
    guest = "guest"
    student = "student"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.student)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    invite_code: Mapped[str | None] = mapped_column(String(50), nullable=True)
    class_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    test_results = relationship("TestResult", back_populates="user", cascade="all, delete-orphan")
    memories = relationship("Memory", back_populates="author", cascade="all, delete-orphan")
