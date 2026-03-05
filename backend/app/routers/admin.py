"""
Административный роутер — только для пользователей с ролью admin.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from ..core.database import get_db
from ..core.security import decode_token, oauth2_scheme
from ..models.user import User, UserRole
from ..models.article import Article
from ..models.comment import Comment
from ..models.memory import Memory
from ..schemas.article import ArticleCreate, ArticleUpdate, ArticleOut

router = APIRouter(prefix="/admin", tags=["admin"])


# ─── Зависимость: только для администраторов ─────────────────────────────────

async def require_admin(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    payload = decode_token(token)
    user_id = int(payload.get("sub", 0))
    user = await db.get(User, user_id)
    if not user or user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ разрешён только администраторам",
        )
    return user


# ─── Статистика ───────────────────────────────────────────────────────────────

@router.get("/stats")
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    articles_total = await db.scalar(select(func.count()).select_from(Article))
    articles_published = await db.scalar(
        select(func.count()).where(Article.is_published == True)
    )
    users_total = await db.scalar(select(func.count()).select_from(User))
    comments_total = await db.scalar(select(func.count()).select_from(Comment))

    sections = (await db.execute(
        select(Article.section, func.count().label("cnt"))
        .group_by(Article.section)
    )).all()

    return {
        "articles": {"total": articles_total, "published": articles_published},
        "users": users_total,
        "comments": comments_total,
        "by_section": [{"section": s, "count": c} for s, c in sections],
    }


# ─── CRUD статей ─────────────────────────────────────────────────────────────

@router.get("/articles", response_model=list[ArticleOut])
async def admin_list_articles(
    section: str | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Все статьи (включая неопубликованные)."""
    query = select(Article)
    if section:
        query = query.where(Article.section == section)
    query = query.order_by(Article.created_at.desc())
    result = await db.execute(query)
    articles = result.scalars().all()

    out = []
    for a in articles:
        count = await db.scalar(
            select(func.count()).where(Comment.article_id == a.id)
        )
        item = ArticleOut.model_validate(a)
        item.comments_count = count or 0
        out.append(item)
    return out


@router.post("/articles", response_model=ArticleOut, status_code=status.HTTP_201_CREATED)
async def admin_create_article(
    data: ArticleCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    article = Article(**data.model_dump())
    db.add(article)
    await db.commit()
    await db.refresh(article)
    out = ArticleOut.model_validate(article)
    out.comments_count = 0
    return out


@router.put("/articles/{article_id}", response_model=ArticleOut)
async def admin_update_article(
    article_id: int,
    data: ArticleUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    article = await db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Статья не найдена")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(article, field, value)

    await db.commit()
    await db.refresh(article)

    count = await db.scalar(
        select(func.count()).where(Comment.article_id == article_id)
    )
    out = ArticleOut.model_validate(article)
    out.comments_count = count or 0
    return out


@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_article(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    article = await db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Статья не найдена")
    await db.delete(article)
    await db.commit()


@router.patch("/articles/{article_id}/publish", response_model=ArticleOut)
async def admin_toggle_publish(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    article = await db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Статья не найдена")
    article.is_published = not article.is_published
    await db.commit()
    await db.refresh(article)
    out = ArticleOut.model_validate(article)
    out.comments_count = 0
    return out


# ─── Управление пользователями ───────────────────────────────────────────────

@router.get("/users")
async def admin_list_users(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    result = await db.execute(
        select(User).order_by(User.created_at.desc())
    )
    users = result.scalars().all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role.value,
            "is_active": u.is_active,
            "class_name": u.class_name,
            "created_at": u.created_at.isoformat(),
        }
        for u in users
    ]


@router.patch("/users/{user_id}/toggle-active")
async def admin_toggle_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Нельзя деактивировать самого себя")
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    user.is_active = not user.is_active
    await db.commit()
    return {"id": user.id, "is_active": user.is_active}


# ─── Модерация комментариев ───────────────────────────────────────────────────

@router.get("/comments")
async def admin_list_comments(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    result = await db.execute(
        select(Comment).order_by(Comment.created_at.desc()).limit(100)
    )
    comments = result.scalars().all()
    return [
        {
            "id": c.id,
            "article_id": c.article_id,
            "user_id": c.user_id,
            "content": c.content,
            "is_approved": c.is_approved,
            "created_at": c.created_at.isoformat(),
        }
        for c in comments
    ]


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    comment = await db.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Комментарий не найден")
    await db.delete(comment)
    await db.commit()


# ─── Модерация воспоминаний ───────────────────────────────────────────────────

@router.get("/memories")
async def admin_list_memories(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    result = await db.execute(
        select(Memory, User.name)
        .join(User, Memory.user_id == User.id)
        .order_by(Memory.is_approved.asc(), Memory.created_at.desc())
    )
    rows = result.all()
    return [
        {
            "id": m.id,
            "user_id": m.user_id,
            "author_name": name,
            "content": m.content,
            "file_urls": m.file_urls or [],
            "is_approved": m.is_approved,
            "created_at": m.created_at.isoformat(),
        }
        for m, name in rows
    ]


@router.patch("/memories/{memory_id}/approve")
async def admin_approve_memory(
    memory_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    memory = await db.get(Memory, memory_id)
    if not memory:
        raise HTTPException(status_code=404, detail="Воспоминание не найдено")
    memory.is_approved = not memory.is_approved
    await db.commit()
    return {"id": memory.id, "is_approved": memory.is_approved}


@router.delete("/memories/{memory_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_memory(
    memory_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    memory = await db.get(Memory, memory_id)
    if not memory:
        raise HTTPException(status_code=404, detail="Воспоминание не найдено")
    await db.delete(memory)
    await db.commit()
