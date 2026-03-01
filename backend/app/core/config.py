import os
from dotenv import load_dotenv

# Carga las variables del archivo .env
load_dotenv() 

# Lee la variable de entorno, con un valor por defecto
# por si el .env falla
DATABASE_URL = os.getenv("DATABASE_URL")

SECRET_KEY = os.getenv("SECRET_KEY")