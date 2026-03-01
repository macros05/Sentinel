from sqlalchemy.orm import Session
from typing import List, Union

from app.models.blocked_app import BlockedApp
from app.schemas.blocked_app import BlockedAppCreate

def create_blocked_app(db: Session, *, user_id: int, app_in: BlockedAppCreate) -> BlockedApp:
    
    db_app= BlockedApp(
        user_id=user_id,
        app_name=app_in.app_name,
        limited_seconds=app_in.limited_seconds,
    )
    
    db.add(db_app)
   
   
    return db_app

def get_blocked_apps_by_user(db: Session, *, user_id: int) -> List[BlockedApp]:
    
    return db.query(BlockedApp).filter(BlockedApp.user_id == user_id).all()

def get_blocked_app(db: Session, *, id: int) -> Union[BlockedApp, None]:
    return db.query(BlockedApp).filter(BlockedApp.id == id).first()

def remove_blocked_app(db: Session, *, id: int) -> BlockedApp:
    obj = db.query(BlockedApp).get(id)

    db.delete(obj)

    return obj