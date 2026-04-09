from fastapi import FastAPI, Depends, HTTPException, Path, Body, Response
from sqlalchemy import text, create_engine
from typing import List
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

# Schemas
from app.schemas.user import UserCreate, UserOut
from app.schemas.session import SessionCreate, SessionOut
from app.schemas.blocked_app import BlockedAppOut, BlockedAppCreate
from app.schemas.app_usage import AppUsageCreate, AppUsageOut
from app.schemas.token import LoginResponse
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate

# CRUD
from app.crud import crud_user, crud_session, crud_user_settings, crud_blocked_app, crud_app_usage, crud_task
 
from app.core import security

from sqlalchemy.orm import Session

from app.db.session import engine, SessionLocal


POMODORO_REWARD_COINS = 10
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://REDACTED", "http://REDACTED:82"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    try:
        with engine.connect() as conn:
            res = conn.execute(text("SELECT 1")).scalar()
        return {"ok": res == 1}
    except Exception as e:
        return {"ok": False, "error": str(e)}
    

@app.post("/auth/register", response_model=UserOut)
def register_user(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = crud_user.get_user_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = crud_user.create_user(db, user_in=user_in)
    return user

@app.post("/sessions/start", response_model=SessionOut)
def start_session(
    session_in: SessionCreate,
    db: Session = Depends(get_db)
):
    session = crud_session.create_session(db, session_in=session_in)
    return session

@app.post("/sessions/complete/{session_id}", response_model=SessionOut)
def complete_session(
    *,
    session_id: int = Path(..., description="The ID of the session to complete"),
    db: Session = Depends(get_db)
):
    db_session = crud_session.get_session(db, session_id=session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if db_session.completed:
        raise HTTPException(status_code=400, detail="Session already completed")
    
    completed_session = crud_session.complete_session(
        db,
        db_session=db_session,
        coins=POMODORO_REWARD_COINS
    )
    
    crud_user_settings.add_coins_to_user(
        db,
        user_id=db_session.user_id,
        coins=POMODORO_REWARD_COINS
    )
    
    db.commit()
    
    db.refresh(completed_session)
    
    return completed_session

@app.post("/blocked-apps", response_model=BlockedAppOut)
def create_blocked_app(
    *,
    app_in: BlockedAppCreate, 
    db: Session = Depends(get_db)
):

    db_app = crud_blocked_app.create_blocked_app(
        db, 
        user_id=app_in.user_id, 
        app_in=app_in
    )
    

    db.commit()
    
    db.refresh(db_app)
    
    return db_app

@app.get("/blocked-apps/user/{user_id}", response_model=List[BlockedAppOut])
def get_blocked_apps_by_user(
    *,
    user_id: int = Path(..., description="The ID of the user"),
    db: Session = Depends(get_db)
):
    db_apps = crud_blocked_app.get_blocked_apps_by_user(
        db,
        user_id=user_id
    )
    
    
    return db_apps

@app.post("/usage/record", response_model=AppUsageOut)
def record_app_usage(
    *,
    usage_in: AppUsageCreate,
    db: Session = Depends(get_db)
):
    db_usage = crud_app_usage.record_usage(
        db,
        user_id=usage_in.user_id,
        usage_in=usage_in
    )
    
    db.commit()
    
    db.refresh(db_usage)
    
    return db_usage

@app.get("/usage/user/{user_id}", response_model=List[AppUsageOut])
def read_app_usage(
    *,
    user_id: int = Path(..., ge=1, description="El ID del usuario"),
    db: Session = Depends(get_db)
):

    usage_history = crud_app_usage.get_usage_by_user(db, user_id=user_id)
    return usage_history

@app.get("/usage/user/{user_id}/date/{usage_date}", response_model=List[AppUsageOut])
def get_usage_by_user_and_date(
    *,
    user_id: int = Path(..., description="The ID of the user"),
    usage_date: str = Path(..., description="The date of usage in YYYY-MM-DD format"),
    db: Session = Depends(get_db)
):
    db_usages = crud_app_usage.get_usage_by_user_and_date(
        db,
        user_id=user_id,
        usage_date=usage_date
    )
    
    return db_usages

@app.post("/auth/login", response_model=LoginResponse)
def login_for_access_token(
    response: Response,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = crud_user.get_user_by_email(db, email=form_data.username)

    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = security.create_token(data={"sub": user.email})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7
    )

    return {"user_id": user.id}


@app.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", samesite="lax")
    return {"message": "Logged out"}

@app.post("/tasks", response_model=TaskOut)
def create_task(
    *,
    task_in: TaskCreate,
    db: Session = Depends(get_db)
):
    
    db_task = crud_task.create_task(
        db,
        user_id = task_in.user_id,
        task_in= task_in
    )

    db.commit()
    db.refresh(db_task)

    return db_task


@app.get("/tasks/user/{user_id}", response_model=List[TaskOut])
def read_tasks(
    *,
    user_id: int = Path(..., ge = 1, description="Id del usuario"),
    db: Session = Depends(get_db)
):
    tasks = crud_task.get_tasks_by_user(db, user_id=user_id)
    return tasks

@app.put("/tasks/{task_id}/", response_model=TaskOut) 
def update_task_status(
    *,
    task_id: int = Path(..., ge = 1, description=("Id tarea a actualizar")),
    task_in: TaskUpdate,
    db: Session = Depends(get_db)
):
    
    db_task = crud_task.get_task(db, task_id=task_id)
    if not db_task:
            raise HTTPException(status_code=404, detail="No encontrada")
    
    update_task = crud_task.update_task(db, db_task=db_task, task_in=task_in)

    db.commit()
    db.refresh(db_task)

    return update_task

@app.delete("/blocked-apps/{id}", response_model=BlockedAppOut)
def delete_blocked_app (
    *,
    id: int = Path(..., ge=1, description="Id app a borrar"),
    db: Session = Depends(get_db)
):

    blocked_app = crud_blocked_app.get_blocked_app(db, id = id)

    if not blocked_app:
        raise HTTPException(status_code=404, detail="App no encontrada")
    
    crud_blocked_app.remove_blocked_app(db, id = id)

    db.commit()
    
    return blocked_app

import subprocess

watcher_process = None

@app.post("/watcher/start")
def start_watcher(email: str, password: str):
    global watcher_process
    if watcher_process and watcher_process.poll() is None:
        return {"message": "El vigilante ya está corriendo"}
    
    # Lanzamos el script pasando las credenciales
    watcher_process = subprocess.Popen(
        ["python", "app/watcher.py", email, password],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    return {"status": "started", "pid": watcher_process.pid}

@app.post("/watcher/stop")
def stop_watcher():
    global watcher_process
    if watcher_process:
        watcher_process.terminate() # Detenemos el proceso
        watcher_process = None
        return {"status": "stopped"}
    return {"message": "El vigilante no está activo"}

import sys # Make sure this is at the top of main.py

@app.post("/watcher/toggle")
def toggle_watcher(payload: dict = Body(...)):
    global watcher_process
    action = payload.get("action")
    
    if action == "start":
        if watcher_process and watcher_process.poll() is None:
            return {"status": "already_running"}
        
        token = payload.get("token")
        user_id = str(payload.get("user_id")) 
     
        watcher_process = subprocess.Popen(
            [sys.executable, "app/watcher.py", token, user_id]
        )
        return {"status": "started", "pid": watcher_process.pid}

    elif action == "stop":
        if watcher_process:
            watcher_process.terminate() 
            watcher_process = None
            return {"status": "stopped"}
        return {"status": "not_running"}


from fastapi.responses import Response

@app.get("/watcher/download")
def download_watcher(token: str, user_id: str):
    watcher_content = f'''import psutil
import time
import requests

API_URL = "http://REDACTED:8081"
LOOP_SECONDS = 5
TOKEN = "{token}"
USER_ID = "{user_id}"

def get_blacklist_from_api():
    headers = {{"Authorization": f"Bearer {{TOKEN}}"}}
    try:
        response = requests.get(f"{{API_URL}}/blocked-apps/user/{{USER_ID}}", headers=headers)
        if response.status_code == 200:
            data = response.json()
            return {{item["app_name"] for item in data if item["is_active"]}}
        return set()
    except Exception as e:
        print(f"Error fetching blacklist: {{e}}")
        return set()

print(f"Watcher iniciado para usuario {{USER_ID}}...")
try:
    while True:
        BLACKLIST = get_blacklist_from_api()
        procesos_actuales = set()
        for proc in psutil.process_iter(["name"]):
            try:
                procesos_actuales.add(proc.info["name"])
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        app_a_reportar = BLACKLIST.intersection(procesos_actuales)
        if app_a_reportar:
            print(f"Reportando: {{app_a_reportar}}")
            for app_name in app_a_reportar:
                payload = {{"app_name": app_name, "seconds": LOOP_SECONDS, "user_id": int(USER_ID)}}
                requests.post(
                    f"{{API_URL}}/usage/record",
                    json=payload,
                    headers={{"Authorization": f"Bearer {{TOKEN}}"}}
                )
        time.sleep(LOOP_SECONDS)
except KeyboardInterrupt:
    print("Watcher detenido.")
'''
    return Response(
        content=watcher_content,
        media_type="text/plain",
        headers={"Content-Disposition": "attachment; filename=sentinel_watcher.py"}
    )