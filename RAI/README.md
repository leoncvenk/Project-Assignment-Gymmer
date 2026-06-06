# RAI

RAI contains the web and mobile application with a shared backend API.

## Structure

* `backend/` - Python API and server
* `frontend/web` - React web application
* `frontend/mobile` - React Native mobile application

---

## Run Backend

```bash
cd backend

python -m venv .venv

# Linux/macOS
source .venv/bin/activate

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

# Optional: install testing dependencies
pip install -r requirements-dev.txt

# Standard development server
uvicorn app.main:app --reload

# Expose backend to external devices (tunneling support)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Run Frontend

### Web

```bash
cd frontend/web

npm install
npm run dev
```

### Mobile

```bash
cd frontend/mobile

npm install
npx expo start
npx expo start --tunnel
```

---

## Tunneling

### Backend API Tunnel

Expose the backend running on port `8000`:

```bash
npx localtunnel --port 8000
```
