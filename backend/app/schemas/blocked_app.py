from pydantic import BaseModel

class BlockedAppBase(BaseModel):

    app_name: str
    limited_seconds: int = 3600
    user_id: int
    
class BlockedAppCreate(BlockedAppBase):
    pass

class BlockedAppOut(BlockedAppBase):   
    id: int
    user_id: int
    is_active: int

    class Config:
        from_attributes = True

