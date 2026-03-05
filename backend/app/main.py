import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from .core.config import settings
from .core.database import engine, Base
from .routers.auth import router as auth_router
from .routers.articles import router as articles_router
from .routers.tests import router as tests_router
from .routers.admin import router as admin_router
from .routers.comments import router as comments_router
from .routers.memories import router as memories_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создаём таблицы при первом запуске (в prod — использовать Alembic)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url=f"{settings.api_prefix}/docs",
    redoc_url=f"{settings.api_prefix}/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутеры
app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(articles_router, prefix=settings.api_prefix)
app.include_router(tests_router, prefix=settings.api_prefix)
app.include_router(admin_router, prefix=settings.api_prefix)
app.include_router(comments_router, prefix=settings.api_prefix)
app.include_router(memories_router, prefix=settings.api_prefix)

# Статические файлы (загруженные пользователями)
uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": "1.0.0",
        "docs": f"{settings.api_prefix}/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
