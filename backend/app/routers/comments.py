from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import datetime
from ..core.database import get_db
from ..core.security import decode_token, oauth2_scheme
from ..models.comment import Comment
from ..models.user import User

router = APIRouter(prefix="/comments", tags=["comments"])


async def require_auth(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    payload = decode_token(token)
    user_id = int(payload.get("sub", 0))
    user = await db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Требуется авторизация")
    return user


class CommentCreate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: int
    article_id: int
    user_id: int
    author_name: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


@router.get("/{article_id}", response_model=list[CommentOut])
async def get_comments(article_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Comment, User.name)
        .join(User, Comment.user_id == User.id)
        .where(Comment.article_id == article_id, Comment.is_approved == True)
        .order_by(Comment.created_at.asc())
    )
    rows = result.all()
    return [
        CommentOut(
            id=c.id,
            article_id=c.article_id,
            user_id=c.user_id,
            author_name=name,
            content=c.content,
            created_at=c.created_at,
        )
        for c, name in rows
    ]


@router.post("/{article_id}", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
async def create_comment(
    article_id: int,
    data: CommentCreate,
    current_user: User = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    if not data.content.strip():
        raise HTTPException(status_code=400, detail="Комментарий не может быть пустым")

    # Сохраняем имя до commit, чтобы не было lazy-load ошибки после коммита
    author_name = current_user.name
    user_id = current_user.id

    comment = Comment(
        article_id=article_id,
        user_id=user_id,
        content=data.content.strip(),
        is_approved=True,
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)

    return CommentOut(
        id=comment.id,
        article_id=comment.article_id,
        user_id=comment.user_id,
        author_name=author_name,
        content=comment.content,
        created_at=comment.created_at,
    )
