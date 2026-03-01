from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from datetime import datetime
from app.db.base import Base
from sqlalchemy.orm import relationship

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"),primary_key=True, index=True)
    
    coins_balance = Column(Integer, default=0, nullable=False)
    
    user = relationship("User", back_populates="settings")