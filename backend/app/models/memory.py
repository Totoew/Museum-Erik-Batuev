from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from ..core.database import Base


class Memory(Base):
    __tablename__ = "memories"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    article_id: Mapped[int | None] = mapped_column(ForeignKey("articles.id"), nullable=True)
    content: Mapped[str] = mapped_column(Text)
    file_urls: Mapped[list] = mapped_column(JSON, default=list)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    author = relationship("User", back_populates="memories")
