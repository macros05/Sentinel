from typing import List
from sqlalchemy.orm import Session
from datetime import date
from app.models.app_usage import AppUsage
from app.schemas.app_usage import AppUsageCreate


def record_usage(db: Session, *,user_id: int, usage_in: AppUsageCreate) -> AppUsage:
    
    db_usage = db.query(AppUsage).filter(
        AppUsage.user_id == user_id,
        AppUsage.app_name == usage_in.app_name,
        AppUsage.date == date.today(),
    ).first()
    if db_usage:
        db_usage.total_seconds += usage_in.seconds
    else:
        db_usage = AppUsage(
            user_id=user_id,
            app_name=usage_in.app_name,
            total_seconds=usage_in.seconds,
            date=date.today(),
        )
        db.add(db_usage)
        
    return db_usage

def get_usage_by_user_and_date(db: Session, *, user_id: int, usage_date: date) -> list[AppUsage]:
    return db.query(AppUsage).filter(
        AppUsage.user_id == user_id,
        AppUsage.date == usage_date,
    ).all()

def get_usage_by_user(db: Session, *, user_id: int) -> List[AppUsage]:

    return db.query(AppUsage)\
             .filter(AppUsage.user_id == user_id)\
             .order_by(AppUsage.date.desc())\
             .all()