import psutil 
import time
import requests
import sys
from datetime import date

# --- CONFIGURATION ---
API_URL = "http://127.0.0.1:8000"
LOOP_SECONDS = 5 

def login_automatic(email, password):
    """Automatically logs in using credentials passed from the backend."""
    try:
        response = requests.post(
            f"{API_URL}/auth/login", 
            data={"username": email, "password": password}
        )

        if response.status_code == 200:
            data = response.json()
            return data["access_token"], data["user_id"]
        else:
            print(f"Login failed: {response.text}")
            return None, None
            
    except requests.ConnectionError:
        print(f"Cannot connect to {API_URL}")
        return None, None

def get_blacklist_from_api(token, user_id):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(f"{API_URL}/blocked-apps/user/{user_id}", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            return {item['app_name'] for item in data if item['is_active']}
        return set()
    except Exception as e:
        print(f"Error fetching blacklist: {e}")
        return set()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Error: Missing arguments. Usage: python watcher.py <token> <user_id>")
        sys.exit(1)

    TOKEN = sys.argv[1]
    USER_ID = sys.argv[2]

    print(f"Watcher started for User {USER_ID} using existing browser token...")

    try: 
        while True:
            BLACKLIST = get_blacklist_from_api(TOKEN, USER_ID)
            
            procesos_actuales = set()
            for proc in psutil.process_iter(['name']):
                try:
                    procesos_actuales.add(proc.info['name'])
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                    pass

            app_a_reportar = BLACKLIST.intersection(procesos_actuales)
            
            if app_a_reportar:
                print(f"[{time.strftime('%H:%M:%S')}] Reporting: {app_a_reportar}")
                for app_name in app_a_reportar:
                    payload = {"app_name": app_name, "seconds": LOOP_SECONDS, "user_id": USER_ID}
                    requests.post(f"{API_URL}/usage/record", json=payload, headers={"Authorization": f"Bearer {TOKEN}"})

            time.sleep(LOOP_SECONDS)

    except KeyboardInterrupt:
        print("\nWatcher stopped.")