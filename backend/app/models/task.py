from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime
from app.db.base import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column (Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable = False, index = True)

    title = Column(String(255), nullable=False)
    
    completed = Column(Boolean, default = False)

    created_at = Column(DateTime, default=datetime.utcnow) 