from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base

class BlockedApp(Base):
    __tablename__ = "blocked_apps"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    app_name = Column(String(255), nullable=False)
    limited_seconds = Column(Integer, nullable=False, default=3600)
    is_active = Column(Integer, nullable=False, default=True)

