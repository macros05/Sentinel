from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from datetime import date
from app.db.base import Base

class AppUsage(Base):
    __tablename__ = "app_usages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    app_name = Column(String(255), nullable=False)
    date = Column(Date, default=date.today, nullable=False)
    total_seconds = Column(Integer, nullable=False, default=0)
    
    __table_args__ = (
        UniqueConstraint('user_id', 'app_name', 'date', name='_user_app_date_uc'),
    )