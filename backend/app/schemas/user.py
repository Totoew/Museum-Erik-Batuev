from pydantic import BaseModel, EmailStr
from datetime import datetime
from ..models.user import UserRole


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    invite_code: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    class_name: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
