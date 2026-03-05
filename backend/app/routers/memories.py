import uuid
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..core.database import get_db
from ..core.security import decode_token, oauth2_scheme
from ..models.memory import Memory
from ..models.user import User

router = APIRouter(prefix="/memories", tags=["memories"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "memories")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


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


class MemoryOut(BaseModel):
    id: int
    user_id: int
    author_name: str
    content: str
    file_urls: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}


@router.get("", response_model=list[MemoryOut])
async def get_memories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Memory, User.name)
        .join(User, Memory.user_id == User.id)
        .where(Memory.is_approved == True)
        .order_by(Memory.created_at.desc())
    )
    rows = result.all()
    return [
        MemoryOut(
            id=m.id,
            user_id=m.user_id,
            author_name=name,
            content=m.content,
            file_urls=m.file_urls or [],
            created_at=m.created_at,
        )
        for m, name in rows
    ]


@router.post("", response_model=MemoryOut, status_code=status.HTTP_201_CREATED)
async def create_memory(
    content: str = Form(...),
    files: list[UploadFile] = File(default=[]),
    current_user: User = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    if not content.strip():
        raise HTTPException(status_code=400, detail="Текст воспоминания не может быть пустым")

    file_urls: list[str] = []
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    for file in files:
        if not file.filename:
            continue

        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Недопустимый тип файла: {ext}. Разрешены: JPG, PNG, GIF, PDF, DOC, DOCX"
            )

        file_data = await file.read()
        if len(file_data) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"Файл {file.filename} превышает лимит 10 МБ")

        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(file_data)

        file_urls.append(f"/uploads/memories/{filename}")

    author_name = current_user.name
    user_id = current_user.id

    memory = Memory(
        user_id=user_id,
        content=content.strip(),
        file_urls=file_urls,
        is_approved=False,
    )
    db.add(memory)
    await db.commit()
    await db.refresh(memory)

    return MemoryOut(
        id=memory.id,
        user_id=memory.user_id,
        author_name=author_name,
        content=memory.content,
        file_urls=memory.file_urls or [],
        created_at=memory.created_at,
    )
