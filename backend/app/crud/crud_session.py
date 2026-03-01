from datetime import datetime
from typing import Union
from sqlalchemy.orm import Session
from app.models.session import Session as SessionModel
from app.schemas.session import SessionCreate

def create_session(db: Session, *, session_in: SessionCreate) -> SessionModel:
    db_session = SessionModel(
        user_id=session_in.user_id,
        start_time=datetime.utcnow(),
        duration_minutes=session_in.duration_minutes,
        completed=False,
        coins_earned=0,
    )
    
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    return db_session

def get_session(db: Session, *, session_id: int) -> Union[SessionModel , None]:
    return db.query(SessionModel).filter(SessionModel.id == session_id).first()

def complete_session(db: Session, *,db_session: SessionModel, coins: int) -> Union [SessionModel , None]:

    db_session.completed = True
    db_session.coins_earned = coins
    
    db.add(db_session)
    
    return db_session