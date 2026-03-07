const API_URL = "https://sentinel.marcosmorales.dev";

let token = null;
let userId = null;
let userEmail = null;
let isWatcherActive = false;
let usageRefreshInterval = null;

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["token", "user_id", "user_email", "watcher_active"], (data) => {
    document.getElementById("loading").style.display = "none";

    if (data.token) {
      token = data.token;
      userId = data.user_id;
      userEmail = data.user_email;
      isWatcherActive = data.watcher_active || false;
      showMainView();
    } else {
      showLoginView();
    }
  });
  
  document.getElementById("loginBtn").addEventListener("click", handleLogin);
  document.getElementById("toggleBtn").addEventListener("click", handleToggleWatcher);
  document.getElementById("logoutBtn").addEventListener("click", handleLogout);

  document.getElementById("passwordInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleLogin();
  });
});

// ─── Views ───────────────────────────────────────────────────────────────────

function showLoginView() {
  document.getElementById("loginView").style.display = "block";
  document.getElementById("mainView").style.display = "none";
  updateStatusBadge(false);
  if (usageRefreshInterval) clearInterval(usageRefreshInterval);
}

function showMainView() {
  document.getElementById("loginView").style.display = "none";
  document.getElementById("mainView").style.display = "block";
  document.getElementById("userEmail").textContent = userEmail || "";
  updateStatusBadge(isWatcherActive);
  updateToggleBtn();
  loadTodayUsage();

  // Auto-refresh cada 10 segundos
  if (usageRefreshInterval) clearInterval(usageRefreshInterval);
  usageRefreshInterval = setInterval(() => {
    loadTodayUsage();
  }, 10000);
}

function updateStatusBadge(active) {
  const badge = document.getElementById("statusBadge");
  badge.textContent = active ? "Activo 🟢" : "Inactivo";
  badge.className = `status-badge ${active ? "active" : "inactive"}`;
}

function updateToggleBtn() {
  const btn = document.getElementById("toggleBtn");
  if (isWatcherActive) {
    btn.textContent = "⏹ Detener Watcher";
    btn.className = "btn btn-danger";
  } else {
    btn.textContent = "▶ Activar Watcher";
    btn.className = "btn btn-primary";
  }
}

// ─── Login ───────────────────────────────────────────────────────────────────

async function handleLogin() {
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value;
  const errorEl = document.getElementById("loginError");

  if (!email || !password) {
    showError(errorEl, "Introduce email y contraseña");
    return;
  }

  document.getElementById("loginBtn").textContent = "Entrando...";
  document.getElementById("loginBtn").disabled = true;

  try {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    if (res.ok) {
      const data = await res.json();
      token = data.access_token;
      userId = data.user_id;
      userEmail = email;

      chrome.storage.local.set({
        token,
        user_id: userId,
        user_email: userEmail,
        watcher_active: false
      });

      showMainView();
    } else {
      showError(errorEl, "Email o contraseña incorrectos");
    }
  } catch (e) {
    showError(errorEl, "No se puede conectar al servidor");
  } finally {
    document.getElementById("loginBtn").textContent = "Entrar";
    document.getElementById("loginBtn").disabled = false;
  }
}

// ─── Watcher toggle ──────────────────────────────────────────────────────────

function handleToggleWatcher() {
  if (isWatcherActive) {
    chrome.runtime.sendMessage({ type: "STOP_WATCHER" }, (res) => {
      isWatcherActive = false;
      updateStatusBadge(false);
      updateToggleBtn();
    });
  } else {
    chrome.runtime.sendMessage({
      type: "START_WATCHER",
      token: token,
      user_id: userId
    }, (res) => {
      isWatcherActive = true;
      updateStatusBadge(true);
      updateToggleBtn();
      loadTodayUsage();
    });
  }
}

// ─── Logout ──────────────────────────────────────────────────────────────────

function handleLogout() {
  if (usageRefreshInterval) clearInterval(usageRefreshInterval);
  chrome.runtime.sendMessage({ type: "STOP_WATCHER" });
  chrome.storage.local.clear();
  token = null;
  userId = null;
  isWatcherActive = false;
  showLoginView();
}

// ─── Usage ───────────────────────────────────────────────────────────────────

async function loadTodayUsage() {
  if (!token || !userId) return;

  const today = new Date().toISOString().split("T")[0];
  try {
    const res = await fetch(`${API_URL}/usage/user/${userId}/date/${today}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const list = document.getElementById("usageList");

    if (res.ok) {
      const data = await res.json();

      const grouped = {};
      for (const item of data) {
        grouped[item.app_name] = (grouped[item.app_name] || 0) + item.seconds;
      }

      if (Object.keys(grouped).length === 0) {
        list.innerHTML = '<div class="empty-msg">Sin distracciones hoy ✨</div>';
        return;
      }

      list.innerHTML = Object.entries(grouped)
        .sort((a, b) => b[1] - a[1])
        .map(([app, secs]) => `
          <div class="usage-item">
            <span class="usage-app">🚫 ${app}</span>
            <span class="usage-time">${formatSeconds(secs)}</span>
          </div>
        `).join("");
    }
  } catch (e) {
    console.error("Error loading usage:", e);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSeconds(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function showError(el, msg) {
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 3000);
}
