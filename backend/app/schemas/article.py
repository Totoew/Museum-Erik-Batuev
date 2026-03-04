from pydantic import BaseModel
from datetime import datetime


class ArticleCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    section: str
    period: str | None = None
    image_url: str | None = None
    audio_url: str | None = None


class ArticleUpdate(BaseModel):
    title: str | None = None
    excerpt: str | None = None
    content: str | None = None
    section: str | None = None
    period: str | None = None
    image_url: str | None = None
    audio_url: str | None = None
    is_published: bool | None = None


class ArticleOut(BaseModel):
    id: int
    title: str
    excerpt: str
    content: str
    section: str
    period: str | None
    image_url: str | None
    audio_url: str | None
    likes_count: int
    is_published: bool
    created_at: datetime
    comments_count: int = 0

    model_config = {"from_attributes": True}
