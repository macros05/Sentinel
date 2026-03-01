from logging.config import fileConfig
from sqlalchemy import create_engine
from alembic import context
import os 
import sys 

# 1. Arregla el PATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 2. Importa la Base (vacía)
from app.db.base import Base

# 3. Importa los Modelos (esto "rellena" la Base)
from app.models.user import User  # noqa: F401
from app.models.session import Session  # noqa: F401
from app.models.user_settings import UserSettings  # noqa: F401
from app.models.app_usage import AppUsage  # noqa: F401
from app.models.blocked_app import BlockedApp  # noqa: F401
from app.models.task import Task

target_metadata = Base.metadata
from dotenv import load_dotenv

load_dotenv() 

DATABASE_URL = os.getenv("DATABASE_URL")

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

def run_migrations_offline() -> None:
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = create_engine(DATABASE_URL)
    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata,
            compare_type=True
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()