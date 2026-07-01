# 🔐 AuthGuard — Production-Style Auth & RBAC

> A full-stack **Authentication & Authorization** system built with **Node.js**, **React**, and **MongoDB**.
> Learn how real-world apps handle user sign-in, token rotation, role-based access, and error handling — all in one project.

This project teaches you how to build a secure, production-ready authentication system from scratch. It covers everything from user registration and login, to automatic token refreshing, to admin-only routes — using patterns and practices found in real companies.

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Folder Structure](#-folder-structure)
4. [Getting Started](#-getting-started)
5. [Authentication Flow](#-authentication-flow)
6. [Token Rotation Flow](#-token-rotation-flow)
7. [Authorization (RBAC) Flow](#-authorization-rbac-flow)
8. [Error Handling Flow](#-error-handling-flow)
9. [API Reference](#-api-reference)
10. [Role Permissions Matrix](#-role-permissions-matrix)
11. [Middleware Execution Order](#-middleware-execution-order)
12. [Environment Variables](#-environment-variables)
13. [Key Concepts Explained](#-key-concepts-explained)
14. [License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔑 JWT Authentication | Access + Refresh token pair for secure, stateless auth |
| 🔄 Refresh Token Rotation | Old refresh tokens are invalidated on every refresh — stops token theft |
| 👥 Role-Based Access Control | Two roles: `USER` and `ADMIN` with different permissions |
| 📝 Notes CRUD | Users can create, read, update, and delete their own notes |
| ⚡ Axios Interceptors | Automatically refreshes expired access tokens — users never see a login wall |
| 🛡️ Global Error Handling | Centralized error handler catches every error in one place |
| ✅ Zod Validation | Validates request data (body, params) with strict schemas |
| 📊 Pino Structured Logging | JSON-based logs for easy searching and monitoring |
| 🌍 Environment-Based Errors | Development shows full error details; production shows safe messages |
| 🔒 Protected & Role-Guarded Routes | Frontend routes that redirect unauthenticated or unauthorized users |

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime for the server |
| **Express** | Web framework for building REST APIs |
| **MongoDB** | NoSQL database for storing users, notes, and tokens |
| **Mongoose** | ODM (Object Data Modeling) library for MongoDB |
| **jsonwebtoken** | Creates and verifies JWT access & refresh tokens |
| **bcryptjs** | Hashes passwords before storing them in the database |
| **Zod** | Schema-based request validation (body, params, query) |
| **Pino** | Fast, structured JSON logger |
| **pino-pretty** | Makes Pino logs human-readable during development |
| **Helmet** | Sets secure HTTP headers automatically |
| **cookie-parser** | Parses cookies (refresh token is stored in an httpOnly cookie) |
| **cors** | Enables Cross-Origin Resource Sharing for the frontend |
| **dotenv** | Loads environment variables from a `.env` file |
| **nodemon** | Auto-restarts the server on file changes (dev only) |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library for building component-based interfaces |
| **Vite** | Lightning-fast build tool and dev server |
| **React Router v6** | Client-side routing with protected route wrappers |
| **Axios** | HTTP client with interceptor support for auto token refresh |
| **React Context API** | Global state management for auth (user, tokens, loading) |
| **react-hot-toast** | Beautiful toast notifications for success/error messages |

---

## 📁 Folder Structure

### Backend (`backend/src/`)

```
backend/
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables (you create this)
└── src/
    ├── server.js             # Entry point — starts Express & connects DB
    ├── app.js                # Express app setup (middleware, routes, error handler)
    │
    ├── config/
    │   ├── env.js            # Centralized env var config (single source of truth)
    │   └── db.js             # MongoDB connection via Mongoose
    │
    ├── models/
    │   ├── user.model.js     # User schema (name, email, password, role, refreshToken)
    │   └── note.model.js     # Note schema (title, content, owner reference)
    │
    ├── repositories/
    │   ├── user.repository.js   # Database queries for User model
    │   └── note.repository.js   # Database queries for Note model
    │
    ├── services/
    │   ├── auth.service.js      # Business logic: register, login, logout, refresh
    │   ├── user.service.js      # Business logic: get profile, update, admin ops
    │   └── note.service.js      # Business logic: CRUD notes with ownership checks
    │
    ├── controllers/
    │   ├── auth.controller.js   # HTTP handlers for /api/auth routes
    │   ├── user.controller.js   # HTTP handlers for /api/users routes
    │   └── note.controller.js   # HTTP handlers for /api/notes routes
    │
    ├── routes/
    │   ├── auth.routes.js       # POST /register, /login, /logout, /refresh
    │   ├── user.routes.js       # GET /me, GET /all (admin), PATCH /role (admin)
    │   └── note.routes.js       # CRUD routes for notes
    │
    ├── middlewares/
    │   ├── auth.middleware.js        # Verifies access token from Authorization header
    │   ├── role.middleware.js        # Checks if user has the required role
    │   ├── validate.middleware.js    # Validates req.body/params against Zod schemas
    │   ├── requestLogger.middleware.js  # Logs every incoming request
    │   └── errorHandler.middleware.js   # Global error handler (dev vs prod responses)
    │
    ├── validators/
    │   ├── auth.validator.js    # Zod schemas for register & login payloads
    │   ├── user.validator.js    # Zod schemas for user-related requests
    │   └── note.validator.js    # Zod schemas for note payloads
    │
    ├── utils/
    │   ├── logger.js            # Pino logger instance configuration
    │   ├── token.js             # Helper functions to sign & verify JWTs
    │   └── AppError.js          # Custom error class with statusCode & isOperational
    │
    └── constants/
        └── roles.js             # Role constants: { USER: 'user', ADMIN: 'admin' }
```

### Frontend (`frontend/src/`)

```
frontend/
├── index.html                # Single HTML page (React SPA entry)
├── package.json              # Dependencies & scripts
├── vite.config.js            # Vite configuration (port 3000, React plugin)
└── src/
    ├── main.jsx              # React entry point — mounts <App /> to #root
    ├── App.jsx               # Root component — sets up Router & AuthProvider
    ├── App.css               # Global styles (dark theme, typography)
    │
    ├── api/
    │   └── axios.js          # Axios instance with baseURL & interceptors
    │
    ├── context/
    │   └── AuthContext.jsx    # Auth state: user, login, logout, loading
    │
    ├── hooks/
    │   └── useAuth.js        # Custom hook to access AuthContext
    │
    ├── components/
    │   ├── Navbar.jsx         # Navigation bar with auth-aware links
    │   ├── ProtectedRoute.jsx # Redirects to /login if not authenticated
    │   └── AdminRoute.jsx     # Redirects if user is not an admin
    │
    ├── pages/
    │   ├── Login.jsx          # Login form page
    │   ├── Register.jsx       # Registration form page
    │   ├── Dashboard.jsx      # User's main page (shows notes)
    │   ├── NoteForm.jsx       # Create/Edit note form
    │   └── AdminPanel.jsx     # Admin-only: manage users and roles
    │
    └── utils/
        └── roles.js           # Role constants & isAdmin() helper
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed on your machine:

| Tool | Version | How to check |
|------|---------|--------------|
| **Node.js** | v18 or higher | `node --version` |
| **npm** | v9 or higher | `npm --version` |
| **MongoDB** | v6 or higher | `mongosh --version` |

> 💡 **Tip:** You can use [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud database) instead of installing MongoDB locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/ErrorAuthRoleArch.git
cd ErrorAuthRoleArch
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file inside the `backend/` folder:

```bash
touch backend/.env
```

Add the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/auth_rbac_db

# JWT Secrets (use long random strings in production!)
ACCESS_TOKEN_SECRET=my-super-secret-access-key-change-me
REFRESH_TOKEN_SECRET=my-super-secret-refresh-key-change-me

# Token Expiry
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Frontend URL (for CORS)
CORS_ORIGIN=http://localhost:3000
```

> ⚠️ **Important:** Never commit your `.env` file to Git! It contains secrets.

### Step 4: Start MongoDB

If running MongoDB locally:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Or start mongod directly
mongod --dbpath /path/to/your/data
```

### Step 5: Start the Backend

```bash
cd backend
npm run dev
```

You should see:

```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000 (development)
```

### Step 6: Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm run dev
```

The app opens automatically at **http://localhost:3000** 🎉

---

## 🔄 Authentication Flow

This diagram shows what happens when a user registers, logs in, and accesses protected resources:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

  ┌──────────┐       ┌──────────────┐       ┌──────────────────┐
  │  User    │       │   Backend    │       │    MongoDB       │
  │ (React)  │       │  (Express)   │       │   (Database)     │
  └────┬─────┘       └──────┬───────┘       └────────┬─────────┘
       │                    │                        │
       │  1. POST /register │                        │
       │  {name,email,pass} │                        │
       │───────────────────>│                        │
       │                    │  2. Hash password       │
       │                    │  3. Save user ────────>│
       │                    │                        │
       │  4. Return success │                        │
       │<───────────────────│                        │
       │                    │                        │
       │  5. POST /login    │                        │
       │  {email, password} │                        │
       │───────────────────>│                        │
       │                    │  6. Find user ────────>│
       │                    │  7. Compare password    │
       │                    │  8. Generate tokens:    │
       │                    │     - Access (15min)    │
       │                    │     - Refresh (7 days)  │
       │                    │  9. Store refresh ────>│
       │                    │                        │
       │  10. Return:       │                        │
       │   accessToken (body)                        │
       │   refreshToken     │                        │
       │   (httpOnly cookie)│                        │
       │<───────────────────│                        │
       │                    │                        │
       │  11. GET /api/notes│                        │
       │  Authorization:    │                        │
       │  Bearer <access>   │                        │
       │───────────────────>│                        │
       │                    │  12. Verify token       │
       │                    │  13. Fetch notes ─────>│
       │                    │                        │
       │  14. Return notes  │                        │
       │<───────────────────│                        │
       │                    │                        │
  ─ ─ ─ ─ ─ ─ 15 minutes later (access token expires) ─ ─ ─ ─ ─ ─
       │                    │                        │
       │  15. GET /api/notes│                        │
       │  (expired token)   │                        │
       │───────────────────>│                        │
       │                    │                        │
       │  16. 401 Unauthorized                       │
       │<───────────────────│                        │
       │                    │                        │
       │  17. Axios interceptor catches 401          │
       │      Automatically calls POST /refresh      │
       │      (sends refreshToken cookie)            │
       │───────────────────>│                        │
       │                    │  18. Verify refresh     │
       │                    │  19. Generate NEW tokens│
       │                    │  20. Invalidate old ──>│
       │                    │      Store new ───────>│
       │                    │                        │
       │  21. New tokens    │                        │
       │<───────────────────│                        │
       │                    │                        │
       │  22. RETRY original request with new token  │
       │───────────────────>│                        │
       │                    │  23. Success! ────────>│
       │  24. Return notes  │                        │
       │<───────────────────│                        │
       │                    │                        │
```

**In simple words:**
1. User signs up → password gets hashed → saved to database
2. User logs in → gets two tokens (short-lived access + long-lived refresh)
3. User makes API calls with the access token
4. When the access token expires → Axios automatically refreshes it using the refresh token
5. The user never notices — it all happens in the background! ✨

---

## 🔄 Token Rotation Flow

Token rotation is a security technique where every time a refresh token is used, it is **replaced** with a brand new one. The old token becomes invalid immediately.

```
┌─────────────────────────────────────────────────────────────────────┐
│                   REFRESH TOKEN ROTATION FLOW                       │
└─────────────────────────────────────────────────────────────────────┘

  NORMAL FLOW (Happy Path):
  ─────────────────────────

  ┌────────┐          ┌──────────┐          ┌──────────┐
  │ Client │          │  Server  │          │ Database │
  └───┬────┘          └────┬─────┘          └────┬─────┘
      │                    │                     │
      │  POST /login       │                     │
      │───────────────────>│                     │
      │                    │                     │
      │                    │  Generate:          │
      │                    │  Access Token  (AT1)│
      │                    │  Refresh Token (RT1)│
      │                    │                     │
      │                    │  Store RT1 ────────>│  DB: refreshToken = RT1
      │                    │                     │
      │  Return AT1 + RT1  │                     │
      │<───────────────────│                     │
      │                    │                     │
      │  ── AT1 expires ── │                     │
      │                    │                     │
      │  POST /refresh     │                     │
      │  Cookie: RT1       │                     │
      │───────────────────>│                     │
      │                    │  Verify RT1         │
      │                    │  Check DB: RT1 === stored RT1?  ✅ YES
      │                    │                     │
      │                    │  Generate:          │
      │                    │  Access Token  (AT2)│
      │                    │  Refresh Token (RT2)│
      │                    │                     │
      │                    │  ╔═══════════════════════════════════╗
      │                    │  ║  INVALIDATE RT1 → Store RT2      ║
      │                    │  ║  RT1 can NEVER be used again!    ║
      │                    │  ╚═══════════════════════════════════╝
      │                    │                     │
      │                    │  Update DB ────────>│  DB: refreshToken = RT2
      │                    │                     │     (RT1 is gone forever)
      │  Return AT2 + RT2  │                     │
      │<───────────────────│                     │
      │                    │                     │


  REUSE DETECTION (Attacker Scenario):
  ─────────────────────────────────────

  Imagine an attacker steals RT1 BEFORE the user refreshes.
  The user refreshes first (normal flow above), getting RT2.
  Now the attacker tries to use the STOLEN RT1:

      │                    │                     │
   [Attacker]              │                     │
      │  POST /refresh     │                     │
      │  Cookie: RT1       │                     │
      │───────────────────>│                     │
      │                    │  Verify RT1         │
      │                    │  Check DB: RT1 === stored RT2?  ❌ NO!
      │                    │                     │
      │                    │  ╔═══════════════════════════════════╗
      │                    │  ║  🚨 REUSE DETECTED!              ║
      │                    │  ║  Someone has the old token!      ║
      │                    │  ║  CLEAR ALL TOKENS → Force logout ║
      │                    │  ╚═══════════════════════════════════╝
      │                    │                     │
      │                    │  Clear tokens ─────>│  DB: refreshToken = null
      │                    │                     │
      │  403 Forbidden     │                     │
      │<───────────────────│                     │
      │                    │                     │
      │  (User must log    │                     │
      │   in again too,    │                     │
      │   for safety)      │                     │
```

**Why does this matter?**
- Without rotation: A stolen refresh token works forever (until it expires — 7 days!)
- With rotation: A stolen token is detected the moment the real user refreshes
- Detection triggers a full logout — both the attacker AND the user lose access
- The user simply logs in again; the attacker cannot

---

## 🛡️ Authorization (RBAC) Flow

RBAC = **Role-Based Access Control**. Different users have different permissions based on their role.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION (RBAC) FLOW                        │
└─────────────────────────────────────────────────────────────────────┘

  Incoming HTTP Request
         │
         ▼
  ┌──────────────────┐
  │  Auth Middleware  │──── Does the request have a valid access token?
  └────────┬─────────┘
           │
     ┌─────┴─────┐
     │           │
   NO ✗        YES ✓
     │           │
     ▼           ▼
  ┌──────┐  ┌──────────────────┐
  │ 401  │  │  Decode token &  │
  │Unauth│  │  attach user to  │
  └──────┘  │  req.user        │
            └────────┬─────────┘
                     │
                     ▼
            ┌──────────────────┐
            │  Role Middleware │──── Does the user's role match
            │  authorize(role) │     the required role?
            └────────┬─────────┘
                     │
               ┌─────┴─────┐
               │           │
             NO ✗        YES ✓
               │           │
               ▼           ▼
            ┌──────┐  ┌──────────────────┐
            │ 403  │  │   Controller     │──── Process the request
            │Forbid│  │   (handle logic) │
            └──────┘  └──────────────────┘


  EXAMPLE — Admin deleting a user:

  DELETE /api/users/123
  Authorization: Bearer <token>
         │
         ▼
  auth.middleware ─── Token valid? ──── YES ──── req.user = { id, role: 'user' }
         │
         ▼
  role.middleware ─── authorize('admin')
         │
         ▼
  req.user.role === 'admin'?  ──── NO  ──── 403 "Access denied. Admin only."
                              ──── YES ──── ✅ Proceed to controller
```

---

## ❌ Error Handling Flow

All errors flow through a single global error handler. This keeps error handling consistent and clean.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ERROR HANDLING FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

  Error Thrown (anywhere in the app)
         │
         ▼
  ┌──────────────────────────┐
  │  Express Error Handler   │
  │  (errorHandler.js)       │
  └────────────┬─────────────┘
               │
               ▼
  ┌──────────────────────────┐
  │  Classify the Error      │
  │                          │
  │  Is it an AppError?      │──── YES ──── Use its statusCode & message
  │  (our custom error)      │
  │                          │──── NO  ──── Check if it's a known type:
  └────────────┬─────────────┘
               │
               ▼
  ┌──────────────────────────────────────────┐
  │  Known Error Types:                       │
  │                                           │
  │  • ValidationError (Zod/Mongoose)         │
  │    → 400 "Invalid input data"             │
  │                                           │
  │  • CastError (bad MongoDB ObjectId)       │
  │    → 400 "Invalid ID format"              │
  │                                           │
  │  • 11000 (duplicate key — email exists)   │
  │    → 409 "Email already registered"       │
  │                                           │
  │  • JsonWebTokenError (bad token)          │
  │    → 401 "Invalid token"                  │
  │                                           │
  │  • TokenExpiredError                      │
  │    → 401 "Token expired"                  │
  │                                           │
  │  • Unknown error                          │
  │    → 500 "Internal Server Error"          │
  └────────────┬──────────────────────────────┘
               │
               ▼
  ┌──────────────────────────────────────────┐
  │  Environment Check: NODE_ENV             │
  │                                           │
  │  ┌─────────────┐    ┌─────────────────┐  │
  │  │ DEVELOPMENT │    │   PRODUCTION    │  │
  │  │             │    │                 │  │
  │  │ Full detail:│    │ Safe response:  │  │
  │  │ • message   │    │ • message       │  │
  │  │ • stack     │    │   (generic if   │  │
  │  │ • statusCode│    │    not          │  │
  │  │ • error obj │    │    operational) │  │
  │  │             │    │ • NO stack      │  │
  │  │ (Helps you  │    │ • NO internals  │  │
  │  │  debug)     │    │                 │  │
  │  │             │    │ (Protects you   │  │
  │  │             │    │  from hackers)  │  │
  │  └─────────────┘    └─────────────────┘  │
  └──────────────────────────────────────────┘
```

**Two types of errors:**

| Type | Example | isOperational | User sees? |
|------|---------|:---:|:---:|
| **Operational** | "Email already exists", "Invalid password" | ✅ Yes | Actual message |
| **Programming** | `undefined.map()`, DB connection crash | ❌ No | "Something went wrong" |

---

## 📚 API Reference

### Auth Routes (`/api/auth`)

| Method | Endpoint | Auth? | Role? | Description |
|--------|----------|:-----:|:-----:|-------------|
| `POST` | `/auth/register` | ❌ | — | Create a new user account |
| `POST` | `/auth/login` | ❌ | — | Login and receive tokens |
| `POST` | `/auth/logout` | ✅ | — | Clear refresh token and cookie |
| `POST`/auth/refresh` | ❌* | — | Get new tokens using refresh cookie |

> *`/refresh` doesn't need the Authorization header — it reads the refresh token from the httpOnly cookie.

### User Routes (`/api/users`)

| Method | Endpoint | Auth? | Role? | Description |
|--------|----------|:-----:|:-----:|-------------|
| `GET` | `/users/me` | ✅ | — | Get current user's profile |
| `PATCH` | `/users/me` | ✅ | — | Update current user's profile |
| `GET` | `/users` | ✅ | `ADMIN` | Get list of all users |
| `DELETE` | `/users/:id` | ✅ | `ADMIN` | Delete a user by ID |
| `PATCH` | `/users/:id/role` | ✅ | `ADMIN` | Change a user's role |

### Note Routes (`/api/notes`)

| Method | Endpoint | Auth? | Role? | Description |
|--------|----------|:-----:|:-----:|-------------|
| `POST` | `/notes` | ✅ | — | Create a new note |
| `GET` | `/notes` | ✅ | — | Get all notes owned by current user |
| `GET` | `/notes/:id` | ✅ | — | Get a specific note (must be owner) |
| `PATCH` | `/notes/:id` | ✅ | — | Update a note (must be owner) |
| `DELETE` | `/notes/:id` | ✅ | — | Delete a note (must be owner) |

---

## 👥 Role Permissions Matrix

| Action | 🧑 USER | 👑 ADMIN |
|--------|:-------:|:--------:|
| Register / Login / Logout | ✅ | ✅ |
| View own profile | ✅ | ✅ |
| Update own profile | ✅ | ✅ |
| Create notes | ✅ | ✅ |
| View own notes | ✅ | ✅ |
| Edit own notes | ✅ | ✅ |
| Delete own notes | ✅ | ✅ |
| View all users | ❌ | ✅ |
| Delete any user | ❌ | ✅ |
| Change user roles | ❌ | ✅ |
| Access Admin Panel | ❌ | ✅ |

---

## 📦 Middleware Execution Order

Every request flows through these layers in order. Think of it as a pipeline:

```
Request from Client
       │
       ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  1. 📊 Request Logger    — Logs method, URL, timestamp     │
  │  2. 🔑 Auth Middleware   — Verifies JWT access token       │
  │  3. 👥 Role Middleware   — Checks user role (if required)  │
  │  4. ✅ Validate          — Validates body/params with Zod  │
  │  5. 🎮 Controller       — Parses HTTP request & response   │
  │  6. ⚙️  Service          — Runs business logic              │
  │  7. 🗄️  Repository       — Executes database query          │
  │  8. 💾 MongoDB           — Reads/writes data               │
  └─────────────────────────────────────────────────────────────┘
       │
       ▼  (if any layer throws an error)
  ┌─────────────────────────────────────────────────────────────┐
  │  9. ❌ Error Handler     — Catches & formats error response │
  └─────────────────────────────────────────────────────────────┘
       │
       ▼
  Response to Client
```

**Detailed order:**

1. **Request Logger** — Logs every incoming request (method, URL, IP, timestamp)
2. **Auth Middleware** — Extracts the `Bearer` token from the `Authorization` header, verifies it, and attaches the decoded user to `req.user`
3. **Role Middleware** — Checks if `req.user.role` matches the required role (e.g., `admin`)
4. **Validate Middleware** — Runs the request body/params through Zod schemas; rejects with 400 if invalid
5. **Controller** — The route handler; parses the request and calls the appropriate service
6. **Service** — Contains business logic (e.g., "does this user own this note?")
7. **Repository** — Executes the actual Mongoose query (find, create, update, delete)
8. **MongoDB** — The database processes the query and returns results
9. **Error Handler** — If ANY step throws an error, it bubbles here for a clean response

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory with these variables:

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `PORT` | No | `5000` | Port the Express server listens on |
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`) |
| `MONGO_URI` | No | `mongodb://localhost:27017/auth_rbac_db` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | **Yes** | — | Secret key for signing access tokens |
| `ACCESS_TOKEN_EXPIRY` | No | `15m` | Access token lifetime (e.g., `15m`, `1h`) |
| `REFRESH_TOKEN_SECRET` | **Yes** | — | Secret key for signing refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | No | `7d` | Refresh token lifetime (e.g., `7d`, `30d`) |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed frontend origin for CORS |

> 🔑 **Generating secure secrets:** Run this in your terminal to generate a random secret:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## 📖 Key Concepts Explained

### Why are access tokens short-lived (15 minutes)?

Access tokens are sent with **every** API request. If one is stolen (from a network attack, XSS, etc.), the damage is limited to 15 minutes. After that, the stolen token is useless. Short lifetimes reduce the "window of vulnerability."

### Why does refresh token rotation exist?

Without rotation, if someone steals your refresh token, they can generate new access tokens forever (for 7 days). With rotation, each refresh token can only be used **once**. After use, it's replaced with a new one. If the old token is used again, the server knows it was stolen and logs everyone out.

### Why are production errors hidden from users?

In development, you want to see full error details (stack traces, variable values) to fix bugs quickly. In production, showing those details would give attackers a roadmap of your code — they'd learn your file structure, database schema, and library versions. So production errors return a generic "Something went wrong" message.

### Why use structured logging (Pino)?

`console.log("user logged in")` works, but you can't search through thousands of those efficiently. Pino outputs logs as JSON:

```json
{"level":"info","time":1718625600000,"msg":"User logged in","userId":"abc123","email":"user@example.com"}
```

JSON logs can be:
- **Searched** — Find all errors in the last hour
- **Filtered** — Show only logs for a specific user
- **Monitored** — Tools like Datadog or ELK Stack can parse them automatically

### Why use the repository pattern?

The repository pattern separates **what data you need** from **how you get it**:

```
WITHOUT Repository:
  Controller → Mongoose query (tightly coupled to MongoDB)

WITH Repository:
  Controller → Service → Repository → Mongoose query
```

Benefits:
- **Swap databases** — Change from MongoDB to PostgreSQL by rewriting only the repository
- **Test easily** — Mock the repository in tests instead of needing a real database
- **Don't repeat yourself** — Multiple services reuse the same repository methods

### What are operational vs. programming errors?

| | Operational Errors | Programming Errors |
|---|---|---|
| **What** | Expected problems in normal operation | Bugs in your code |
| **Examples** | Invalid user input, expired token, network timeout | `undefined.map()`, typo in variable name |
| **Can you handle them?** | ✅ Yes — show user a helpful message | ❌ No — fix the code |
| **isOperational** | `true` | `false` |
| **In production** | Show the actual error message | Show "Something went wrong" |

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 AuthGuard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Built with ❤️ to teach real-world authentication & authorization patterns.
  <br/>
  <strong>Star ⭐ this repo if you found it helpful!</strong>
</p>
