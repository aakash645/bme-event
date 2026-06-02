# EventFlow — Event Registration & Check-in System

A full-stack event management application built with React, Node.js/Express, and MongoDB Atlas.

## Features

- **Public registration** — attendees register with name, phone, email, company
- **Additional guests** — add unlimited extra guests per registration (same fields)
- **Admin dashboard** — view all registrations, search, filter, paginate, delete
- **Live check-in** — search and mark attendees as checked in at the event
- **Per-guest check-in** — check in primary + each additional guest individually
- **CSV export** — download all or only checked-in attendees as CSV
- **JWT auth** — protected admin routes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Forms | React Hook Form |
| HTTP | Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs |
| CSV Export | json2csv |
| Notifications | react-hot-toast |

---

## Project Structure

```
event-app/
├── server/
│   ├── models/
│   │   ├── Registration.js    # Guest schema + registration code
│   │   └── Admin.js           # Admin user with hashed password
│   ├── routes/
│   │   ├── auth.js            # Login + admin setup
│   │   ├── register.js        # Public registration endpoint
│   │   ├── admin.js           # Dashboard data + CSV export
│   │   └── checkin.js         # Search + check-in endpoints
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   └── index.js               # Express app entry point
│
└── client/
    └── src/
        ├── pages/
        │   ├── Register.jsx        # Public registration form
        │   ├── Success.jsx         # Post-registration success screen
        │   ├── AdminLogin.jsx      # Admin login
        │   ├── AdminDashboard.jsx  # Registrations table with stats
        │   └── CheckIn.jsx         # Live event check-in
        ├── components/
        │   ├── Navbar.jsx
        │   ├── GuestFields.jsx     # Reusable guest form fields
        │   └── ProtectedRoute.jsx
        ├── hooks/
        │   └── useAuth.jsx         # Auth context + localStorage
        └── utils/
            └── api.js              # Axios instance with JWT interceptor
```

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd event-app
npm install          # root (concurrently)
cd server && npm install
cd ../client && npm install
```

### 2. Configure server environment

```bash
cd server
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/event-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

### 3. MongoDB Atlas setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user with read/write access
3. Whitelist your IP address (or use `0.0.0.0/0` for dev)
4. Copy the connection string into `MONGODB_URI`

### 4. Create your admin account

Start the server, then run once:

```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "yourpassword"}'
```

> This endpoint only works if no admin exists yet.

### 5. Run the app

```bash
# From root — runs both server and client
npm run dev

# Or separately:
npm run server    # Express on :5000
npm run client    # Vite on :5173
```

---

## API Reference

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Submit event registration |
| `POST` | `/api/auth/setup` | One-time admin account creation |
| `POST` | `/api/auth/login` | Admin login → JWT |

### Protected (require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/registrations` | List registrations (search, filter, paginate) |
| `DELETE` | `/api/admin/registrations/:id` | Delete a registration |
| `GET` | `/api/admin/export?type=all\|checkedIn` | Download CSV |
| `GET` | `/api/checkin/search?q=` | Search attendees |
| `PATCH` | `/api/checkin/:id/primary` | Check in primary guest |
| `PATCH` | `/api/checkin/:id/guest/:index` | Check in additional guest |

---

## Deployment

### Backend — Railway / Render

1. Push `server/` to GitHub
2. Set environment variables in Railway/Render dashboard
3. Deploy — it auto-detects Node.js

### Frontend — Vercel

1. Push `client/` to GitHub
2. Set `VITE_API_URL` if not using a proxy
3. Update `vite.config.js` proxy target to your deployed backend URL

---

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Registration form |
| `/success` | Public | Post-registration confirmation |
| `/admin/login` | Public | Admin login |
| `/admin/dashboard` | Admin only | Registrations table + stats |
| `/admin/checkin` | Admin only | Live check-in interface |
