# RAI

RAI contains the web and mobile application with a shared backend API.

## Structure

- `backend/` - Python API and server
- `frontend/web` - React app
- `frontend/mobile` - React Native app

---

## Run backend

```bash
cd backend
python -m venv .venv

# Linux
source .venv/bin/activate
# Windows
.venv\Scripts\activate

pip install -r requirements.txt
# for tests
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

---

## Run frontend

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
```
