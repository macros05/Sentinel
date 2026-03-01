from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey
from datetime import datetime
from app.db.base import Base 


class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    start_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=25)
    
    completed = Column(Boolean, default=False, nullable=False)
    
    coins_earned = Column(Integer, default=0, nullable=False)