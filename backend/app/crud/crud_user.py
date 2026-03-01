from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password
from app.models.user_settings import UserSettings
from typing import Union

def create_user(db: Session, *, user_in: UserCreate) -> User:
    
    
    hashed_password = hash_password(user_in.password)
    
    db_user = User(
        email=user_in.email,
        password_hash=hashed_password,
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    db_settings = UserSettings(
        user=db_user,
        coins_balance=0,
    )
    
    db.add(db_settings)
    db.commit()
    
    return db_user

def get_user_by_email(db: Session, *, email: str) -> Union [User , None]:
    
    
    return db.query(User).filter(User.email == email).first()
