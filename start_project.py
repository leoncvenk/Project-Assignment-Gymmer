import os
import subprocess
import platform
import sys
import socket
import time

def get_default_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def write_env(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Created/updated: {filepath}")

def setup_envs():
    mandatory_envs = [
        "NPO/.env",
        "RAI/backend/.env",
        "RAI/frontend/mobile/.env"
    ]

    if all(os.path.exists(path) for path in mandatory_envs):
        print("\n--- Environment Setup (.env) ---")
        print("All required .env files already exist. Skipping setup.\n")
        return

    print("\n--- Environment Setup (.env) ---")
    
    default_ip = get_default_ip()
    ip_address = input(f"Enter your local IP address [{default_ip}]: ").strip() or default_ip
    
    mongo_user = input("Enter MongoDB username: ").strip()
    mongo_pass = input("Enter MongoDB password: ").strip()
    mongo_uri = f"mongodb+srv://{mongo_user}:{mongo_pass}@rai.fnzoqrv.mongodb.net/?appName=RAI"
    
    roboflow_key = input("Enter ROBOFLOW_API_KEY for ORV (optional, press Enter to skip): ").strip()

    write_env("NPO/.env", f"MQTT_BROKER_HOST={ip_address}\nMQTT_PORT=1883\n")

    if roboflow_key:
        write_env("ORV/.env", f"ROBOFLOW_API_KEY={roboflow_key}\n")

    rai_backend_env = f"""MONGO_URI={mongo_uri}
DB_NAME=gymmer
TEST_DB_NAME=rai_test_local
ORV_API_URL=http://127.0.0.1:8001
"""
    write_env("RAI/backend/.env", rai_backend_env)

    rai_mobile_env = f"""EXPO_PUBLIC_API_URL=http://{ip_address}:8000
EXPO_PUBLIC_MQTT_BROKER_URL={ip_address}
EXPO_PUBLIC_MQTT_PORT=9001
"""
    write_env("RAI/frontend/mobile/.env", rai_mobile_env)
    print("All .env files are ready!\n")

def run_cmd(cmd, cwd=".", wait=True):
    use_shell = platform.system() == "Windows"
    print(f"Running in '{cwd}': {' '.join(cmd)}")
    
    if wait:
        subprocess.run(cmd, cwd=cwd, shell=use_shell, check=True)
    else:
        return subprocess.Popen(cmd, cwd=cwd, shell=use_shell)

def get_venv_python(cwd):
    if platform.system() == "Windows":
        return os.path.join(".venv", "Scripts", "python.exe")
    else:
        return os.path.join(".venv", "bin", "python")

def setup_python_project(cwd):
    print(f"\n--- Checking python project : {cwd} ---")
    
    venv_path = os.path.join(cwd, ".venv")
    if not os.path.exists(venv_path):
        print(f"Creating venv in {cwd}...")
        run_cmd([sys.executable, "-m", "venv", ".venv"], cwd=cwd)
    
    py_exec = get_venv_python(cwd)
    run_cmd([py_exec, "-m", "pip", "install", "-r", "requirements.txt"], cwd=cwd)
    return py_exec

def main():
    setup_envs()
    
    processes = []

    try:
        print("\n--- NPO Running Docker (Docker Compose) ---")
        run_cmd(["docker", "compose", "up", "-d"], cwd="NPO")

        orv_py = setup_python_project("ORV")
        print("Starting ORV API (port 8001)...")
        processes.append(run_cmd([orv_py, "api.py"], cwd="ORV", wait=False))

        rai_py = setup_python_project("RAI/backend")
        print("Starting RAI Backend (port 8000)...")
        processes.append(run_cmd([rai_py, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"], cwd="RAI/backend", wait=False))

        print("\n--- Preparing RAI Mobile Frontend ---")
        run_cmd(["npm", "install"], cwd="RAI/frontend/mobile")
        print("Starting Expo mobile app...")
        processes.append(run_cmd(["npx", "expo", "start"], cwd="RAI/frontend/mobile", wait=False))

        print("\n--- Preparing RAI Web Frontend ---")
        run_cmd(["npm", "install"], cwd="RAI/frontend/web")
        print("Starting React web app...")
        processes.append(run_cmd(["npm", "run", "dev"], cwd="RAI/frontend/web", wait=False))

        print("\nWaiting for services to initialize... (5 seconds)")
        time.sleep(5)

        local_ip = get_default_ip()
        
        print("\n" + "="*60)
        print("ALL SYSTEMS ARE RUNNING!")
        print("="*60)
        print("You can access the services at the following URLs:\n")
        print(f"RAI Backend API Docs:   http://localhost:8000/docs")
        print(f"ORV API Docs:           http://localhost:8001/docs")
        print(f"Mobile API Target:      http://{local_ip}:8000")
        print(f"Web Frontend (Local):   http://localhost:5173")
        print(f"Web Frontend (Network): http://{local_ip}:5173")
        print("\nMobile Frontend:")
        print("Check the Expo logs above to scan the QR code with your phone.")
        print("\nHow to stop:")
        print("Press CTRL+C in this terminal to safely stop all processes.")
        print("="*60 + "\n")
        
        for p in processes:
            p.wait()

    except KeyboardInterrupt:
        print("\n\nStopping processes...")
        for p in processes:
            p.terminate()
        print("Processes successfully stopped.")
    except Exception as e:
        print(f"\nAn error occurred: {e}")
        for p in processes:
            p.terminate()

if __name__ == "__main__":
    main()