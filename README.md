
# 🌲 Sentinel

**Sentinel** es una aplicación de productividad de escritorio que combina un temporizador Pomodoro, un bloqueador de aplicaciones y una lista de tareas para ayudarte a mantener el foco durante tus sesiones de trabajo.

---

## ✨ Características

- **⏱️ Temporizador Pomodoro** — Sesiones configurables de 5, 25 o 50 minutos con seguimiento automático de sesiones completadas.
- **🛡️ Zona Prohibida (App Watcher)** — Bloquea aplicaciones distractoras en tiempo real mientras el vigilante está activo.
- **📋 Checklist** — Gestiona tus tareas del día directamente desde el dashboard.
- **📊 Consumo de Hoy** — Visualiza qué aplicaciones has usado y cuánto tiempo has pasado en ellas durante la sesión.
- **🔐 Autenticación** — Sistema de login con tokens de sesión.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular + TypeScript + SCSS |
| Backend | Python (FastAPI) |
| Base de datos | MySQL |
| Comunicación | REST API (HTTP) |

---

## 📁 Estructura del Proyecto

```
Sentinel/
├── frontend/          # Aplicación Angular
│   └── src/
│       ├── app/
│       │   ├── components/
│       │   │   ├── app-usage-list/     # Consumo de apps
│       │   │   ├── blocked-apps-list/  # Zona Prohibida
│       │   │   └── task-list/          # Checklist
│       │   ├── pages/
│       │   │   └── dashboard/          # Vista principal
│       │   └── services/
│       │       ├── session/            # Gestión de sesiones Pomodoro
│       │       └── blocked-app/        # Gestión de apps bloqueadas
├── backend/           # API en Python
├── mysql/             # Scripts de base de datos
└── documentacion_sentinel.docx
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos

- Node.js >= 18
- Angular CLI (`npm install -g @angular/cli`)
- Python >= 3.10
- MySQL

### 1. Clonar el repositorio

```bash
git clone https://github.com/macros05/Sentinel.git
cd Sentinel
```

### 2. Base de datos

```bash
# Importar el esquema en tu instancia de MySQL
mysql -u root -p < mysql
```

### 3. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

El backend se levantará en `http://127.0.0.1:8000`.

### 4. Frontend

```bash
cd frontend
npm install
ng serve
```

La app estará disponible en `http://localhost:4200`.

---

## ⚙️ Configuración

En el frontend, la URL del backend se configura en `dashboard.ts`:

```typescript
private apiUrl = "http://127.0.0.1:8000";
```

Asegúrate de que coincide con el puerto donde corre tu backend.

---

## 🖥️ Uso

1. **Inicia sesión** con tu cuenta.
2. Desde el **dashboard**, selecciona la duración de tu sesión (5m, 25m o 50m).
3. Pulsa **Start Watcher** para activar el vigilante de aplicaciones.
4. Añade las apps que quieres bloquear en la **Zona Prohibida**.
5. Añade tus objetivos del día en el **Checklist**.
6. Pulsa **Start** para comenzar el temporizador y ¡a trabajar!

---

## 📄 Licencia

Este proyecto es de uso personal/educativo. Consulta `documentacion_sentinel.docx` para más detalles sobre la arquitectura y decisiones de diseño.
