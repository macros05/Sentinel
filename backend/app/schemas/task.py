from pydantic import BaseModel
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    completed: bool = False

class TaskCreate(TaskBase):
    user_id: int

class TaskUpdate(BaseModel):
    completed: bool

class TaskOut(TaskBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_atributtes: True
