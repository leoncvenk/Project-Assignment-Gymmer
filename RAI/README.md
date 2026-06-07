# RAI

RAI contains the web and mobile application with a shared backend API.

## Structure

- `backend/` - Python API and server
- `frontend/web` - React web application
- `frontend/mobile` - React Native mobile application

---

# Prerequisites

Before starting the project, make sure all required `.env` files are correctly configured.

Required locations:

```text
NPO/.env
RAI/backend/.env
RAI/frontend/mobile/.env
```

If any of these files are missing or incorrectly configured, parts of the system may not work correctly.

---

# Start NPO Services

Navigate to the NPO project and start all required Docker services:

```bash
cd NPO

docker compose up -d
```

Verify that all containers are running before continuing.

---

# Run Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment:

### Linux/macOS

```bash
source .venv/bin/activate
```

### Windows

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Optional development dependencies:

```bash
pip install -r requirements-dev.txt
```

Start the backend server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

> The `--host 0.0.0.0` option allows access from other devices on the network and is required for mobile development and tunneling.

After startup the API should be available at:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

# Run Frontend

## Web Application

```bash
cd frontend/web

npm install

npm run dev
```

---

## Mobile Application

```bash
cd frontend/mobile

npm install

npx expo start
```

If testing on a physical device from another network, you can use:

```bash
npx expo start --tunnel
```

---

# Tunneling

## Backend API Tunnel

Expose the backend running on port `8000`:

```bash
npx localtunnel --port 8000
```

After the tunnel is created, update the backend API URL in the mobile application's `.env` file if required.

---

# Full Startup Order

For the smoothest setup, follow this order:

1. Configure all required `.env` files.
2. Start Docker services in the `NPO` project.
3. Start the RAI backend.
4. Verify the backend is reachable via `http://localhost:8000/docs`.
5. Start the mobile or web frontend.
6. If testing on external devices, create a tunnel and update environment variables accordingly.
