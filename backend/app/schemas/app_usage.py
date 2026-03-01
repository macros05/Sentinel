from pydantic import BaseModel
from datetime import date

class AppUsageBase(BaseModel):
    app_name: str
    seconds: int = 0
    user_id: int
    
class AppUsageCreate(AppUsageBase):
    pass

class AppUsageOut(AppUsageBase):
    id: int
    date: date
    total_seconds: int
    
    class Config:
        from_attributes = True