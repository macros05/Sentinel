from sqlalchemy.orm import Session
from app.models.user_settings import UserSettings
from typing import Union

def add_coins_to_user(db: Session, *, user_id: int, coins: int) -> Union [UserSettings , None]:

    db_settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    
    if db_settings:
        db_settings.coins_balance += coins
        db.add(db_settings)
        db.commit()
        
        return db_settings
    
    return None