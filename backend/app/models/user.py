from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db.base import Base # Importa el lienzo
from sqlalchemy.orm import relationship

# Esta clase se "pinta" a sí misma en la Base
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(191), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    settings = relationship("UserSettings", back_populates="user", uselist=False)