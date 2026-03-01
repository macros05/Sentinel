# 🌲 Sentinel

**Sentinel** is a desktop productivity app that combines a Pomodoro timer, an app blocker, and a task manager to help you stay focused during your work sessions.

---

## ✨ Features

- **⏱️ Pomodoro Timer** — Configurable sessions of 5, 25 or 50 minutes with automatic tracking of completed sessions.
- **🛡️ Forbidden Zone (App Watcher)** — Blocks distracting applications in real time while the watcher is active.
- **📋 Checklist** — Manage your daily tasks directly from the dashboard.
- **📊 Today's Usage** — Visualize which apps you've used and how much time you've spent on them during the session.
- **🔐 Authentication** — Login system with session tokens.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular + TypeScript + SCSS |
| Backend | Python (FastAPI) |
| Database | MySQL |
| Communication | REST API (HTTP) |

---

## 📁 Project Structure

```
Sentinel/
├── frontend/          # Angular application
│   └── src/
│       ├── app/
│       │   ├── components/
│       │   │   ├── app-usage-list/     # App usage tracking
│       │   │   ├── blocked-apps-list/  # Forbidden Zone
│       │   │   └── task-list/          # Checklist
│       │   ├── pages/
│       │   │   └── dashboard/          # Main view
│       │   └── services/
│       │       ├── session/            # Pomodoro session management
│       │       └── blocked-app/        # Blocked apps management
├── backend/           # Python API
├── mysql/             # Database scripts
└── documentacion_sentinel.docx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Angular CLI (`npm install -g @angular/cli`)
- Python >= 3.10
- MySQL

### 1. Clone the repository

```bash
git clone https://github.com/macros05/Sentinel.git
cd Sentinel
```

### 2. Database

```bash
# Import the schema into your MySQL instance
mysql -u root -p < mysql
```

### 3. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend available at `http://127.0.0.1:8000`.

### 4. Frontend

```bash
cd frontend
npm install
ng serve
```

App available at `http://localhost:4200`.

---

## ⚙️ Configuration

In the frontend, the backend URL is configured in `dashboard.ts`:

```typescript
private apiUrl = "http://127.0.0.1:8000";
```

Make sure it matches the port where your backend is running.

---

## 🖥️ Usage

1. **Sign in** with your account.
2. From the **dashboard**, select your session duration (5m, 25m or 50m).
3. Click **Start Watcher** to activate the app blocker.
4. Add the apps you want to block in the **Forbidden Zone**.
5. Add your daily goals in the **Checklist**.
6. Click **Start** to begin the timer and get to work!

---

## 📄 License

This project is for personal/educational use. See `documentacion_sentinel.docx` for more details on the architecture and design decisions.
