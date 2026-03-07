const API_URL = "https://sentinel.marcosmorales.dev";
const REPORT_INTERVAL_SECONDS = 5;

let isWatcherActive = false;
let token = null;
let userId = null;
let blockedApps = [];

// ─── Init ────────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["token", "user_id", "watcher_active"], (data) => {
    token = data.token || null;
    userId = data.user_id || null;
    isWatcherActive = data.watcher_active || false;
    if (isWatcherActive && token) startWatcher();
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["token", "user_id", "watcher_active"], (data) => {
    token = data.token || null;
    userId = data.user_id || null;
    isWatcherActive = data.watcher_active || false;
    if (isWatcherActive && token) startWatcher();
  });
});

// ─── Messages from popup ─────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START_WATCHER") {
    token = message.token;
    userId = message.user_id;
    chrome.storage.local.set({ token, user_id: userId, watcher_active: true });
    startWatcher();
    sendResponse({ status: "started" });
  }

  if (message.type === "STOP_WATCHER") {
    stopWatcher();
    sendResponse({ status: "stopped" });
  }

  if (message.type === "GET_STATUS") {
    sendResponse({ active: isWatcherActive, blockedApps: blockedApps });
  }

  return true;
});

// ─── Watcher ─────────────────────────────────────────────────────────────────

function startWatcher() {
  isWatcherActive = true;
  fetchBlockedApps();
  chrome.alarms.create("sentinel_tick", { periodInMinutes: 0.1 });
  chrome.alarms.create("sentinel_fetch_apps", { periodInMinutes: 1 });
  console.log("Sentinel Watcher started");
}

function stopWatcher() {
  isWatcherActive = false;
  chrome.alarms.clear("sentinel_tick");
  chrome.alarms.clear("sentinel_fetch_apps");
  chrome.storage.local.set({ watcher_active: false });
  console.log("Sentinel Watcher stopped");
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (!isWatcherActive) return;
  if (alarm.name === "sentinel_tick") checkActiveTabs();
  if (alarm.name === "sentinel_fetch_apps") fetchBlockedApps();
});

// ─── Core functions ──────────────────────────────────────────────────────────

async function fetchBlockedApps() {
  if (!token || !userId) return;
  try {
    const res = await fetch(`${API_URL}/blocked-apps/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      blockedApps = data.filter(app => app.is_active);
      console.log("Blocked apps:", blockedApps.map(a => a.app_name));
    }
  } catch (e) {
    console.error("Error fetching blocked apps:", e);
  }
}

function checkActiveTabs() {
  if (!isWatcherActive || !token || blockedApps.length === 0) return;

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (!tabs || tabs.length === 0) return;
    const activeTab = tabs[0];
    if (!activeTab.url) return;

    const matchedApp = getMatchingApp(activeTab.url);
    if (matchedApp) {
      console.log(`Detected: ${matchedApp.app_name}`);
      await reportUsage(matchedApp.app_name, REPORT_INTERVAL_SECONDS);
    }
  });
}

function getMatchingApp(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    for (const app of blockedApps) {
      const stored = app.app_name.toLowerCase().replace(/^www\./, "").trim();
      if (hostname === stored ||
          hostname.endsWith("." + stored) ||
          stored.endsWith("." + hostname) ||
          hostname.includes(stored)) {
        return app;
      }
    }
  } catch (e) {}
  return null;
}

async function reportUsage(appName, seconds) {
  if (!token || !userId) return;
  try {
    const res = await fetch(`${API_URL}/usage/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        app_name: appName,
        seconds: seconds,
        user_id: parseInt(userId)
      })
    });
    if (res.ok) console.log(`Reported ${seconds}s of ${appName}`);
  } catch (e) {
    console.error("Error reporting:", e);
  }
}
