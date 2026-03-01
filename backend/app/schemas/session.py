from pydantic import BaseModel
from datetime import datetime

class SessionBase(BaseModel):
    user_id: int
    duration_minutes: int = 25

class SessionCreate(SessionBase):
    pass

class SessionOut(SessionBase):
    id: int
    start_time: datetime
    completed: bool
    coins_earned: int

    class Config:
        from_attributes = True 