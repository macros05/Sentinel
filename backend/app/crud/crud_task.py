from sqlalchemy.orm import Session
from typing import List, Union
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

def create_task(db: Session, *, user_id: int, task_in: TaskCreate) -> Task:
    db_task = Task(
        user_id=user_id,
        title=task_in.title,
        completed=task_in.completed
    )
    db.add(db_task)
    return db_task

def get_tasks_by_user(db: Session, *, user_id: int) -> List[Task]:
    return db.query(Task).filter(Task.user_id == user_id).order_by(Task.created_at.desc()).all()

def update_task(db: Session, *, db_task: Task, task_in: TaskUpdate) -> Task:
    db_task.completed = task_in.completed
    return db_task

def get_task(db: Session, *, task_id: int) -> Union[Task , None]:
    return db.query(Task).filter(Task.id == task_id).first()