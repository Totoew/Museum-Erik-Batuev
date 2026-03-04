# Виртуальный музей Эрика Батуева

Веб-приложение — виртуальный музей удмуртского поэта и журналиста Эрика Батуева (Валерий Батуев, 1969–2002).

## Стек технологий

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS v4 + React Router
- **Backend**: FastAPI (Python 3.13) + SQLAlchemy async + PostgreSQL
- **База данных**: PostgreSQL 15 (через Docker)

---

## Быстрый старт

### Требования

- Node.js 18+
- Python 3.13
- Docker + Docker Compose

---

### 1. База данных

```bash
docker compose up postgres -d
```

PostgreSQL поднимется на порту `5432`.
Параметры: `museum:museum_pass@localhost:5432/museum_db`

---

### 2. Бэкенд

```bash
cd backend

# Создать виртуальное окружение (только первый раз)
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Запустить сервер
uvicorn app.main:app --reload
```

Бэкенд будет доступен на `http://localhost:8000`
API документация: `http://localhost:8000/api/v1/docs`

#### Заполнить базу данных (только первый раз)

```bash
# В том же терминале с активным .venv
python seed.py
```

Создаёт:
- Аккаунт администратора: `admin@batuev-museum.ru` / `Admin2026!`
- 10 статей по разделам (биография, поэзия, журналистика, исследования)
- 1 тест с вопросами по биографии

---

### 3. Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Сайт откроется на `http://localhost:5173`

---

## Структура проекта

```
museum-Erik-Batuev/
├── frontend/               # React + TypeScript + Vite
│   └── src/
│       ├── api/            # API клиент (client.ts)
│       ├── components/     # Компоненты (Navbar, Footer, LoginModal, ...)
│       ├── context/        # AuthContext
│       └── pages/          # Страницы сайта
├── backend/                # FastAPI
│   └── app/
│       ├── core/           # Конфиг, БД, авторизация
│       ├── models/         # SQLAlchemy модели
│       ├── routers/        # API роутеры
│       └── schemas/        # Pydantic схемы
│   ├── seed.py             # Начальные данные
│   └── requirements.txt
└── docker-compose.yml
```

---

## Разделы сайта

| URL | Описание |
|-----|----------|
| `/` | Главная — герой, карта, быстрый доступ |
| `/biography` | Биография по периодам |
| `/works` | Творчество: поэзия, проза, переводы |
| `/journalism` | Журналистские материалы |
| `/archives` | Архивные фото, документы, аудио |
| `/research` | Исследовательские статьи |
| `/interactive` | Лента жизни, маршруты, воспоминания |
| `/education` | Тесты и задания |
| `/profile` | Личный кабинет пользователя |
| `/admin` | Панель администратора (только для admin) |

---

## Роли пользователей

| Роль | Возможности |
|------|-------------|
| `guest` | Чтение всех публичных материалов |
| `student` | Комментарии, прохождение тестов |
| `admin` | Полное управление контентом через `/admin` |

---

## Переменные окружения

Создай файл `backend/.env` для переопределения настроек:

```env
DATABASE_URL=postgresql+asyncpg://museum:museum_pass@localhost:5432/museum_db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=sk-...         # для AI-генерации тестов (опционально)
TELEGRAM_BOT_TOKEN=...        # для Telegram-бота (опционально)
```
