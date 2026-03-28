# 📖 DOCUMENTATION - RESTful Users API

## 🎯 General Description
RESTful API built with **Node.js**, **Express 5**, **MySQL**, and **Sequelize** for complete user management with JWT authentication. Includes a detailed layered logging system, robust validation with express-validator, and centralized error handling.

---

## 📁 Project Structure

```
📁 apirestful/
├── 📄 package.json            # Project configuration and dependencies
├── 📄 .env                    # Environment variables (DB, JWT, Port)
├── 📄 .gitignore              # Files excluded from Git
├── 📄 TASK.md                 # Original project assignment
├── 📄 DOCUMENT.md             # This documentation
│
└── src/
    ├── app.js              ← Express configuration (middlewares, routes, view engine)
    ├── server.js           ← Entry point: starts the server and connects to DB
    │
    ├── config/
    │   └── database.js     ← MySQL connection with Sequelize (uses .env variables)
    │
    ├── controllers/
    │   ├── authController.js   ← Business logic for registration and login
    │   └── userController.js   ← Business logic for profile (view, update, delete)
    │
    ├── middleware/
    │   ├── authMiddleware.js   ← Verifies JWT token on protected routes
    │   ├── errorHandler.js     ← Catches unhandled errors and responds with consistent format
    │   └── validation.js       ← Processes validation results (handleValidationErrors, sanitizeInput)
    │
    ├── models/
    │   ├── User.js         ← Sequelize User model (defines columns, hooks for password hashing)
    │   └── index.js        ← Exports all models (central access point)
    │
    ├── routes/
    │   ├── index.js        ← Root route (serves the EJS test panel view)
    │   ├── authRoutes.js   ← Routes /api/auth/* (register, login)
    │   └── userRoutes.js   ← Routes /api/users/* (profile CRUD)
    │
    ├── utils/
    │   └── validators.js   ← Declarative validation rules with express-validator
    │
    ├── views/
    │   └── index.ejs       ← HTML frontend of the test panel
    │
    └── public/
        └── css/
            └── styles.css  ← Styles for the test panel
```

---

## 🔄 Application Data Flow

### 📊 MVC Architecture (Model-View-Controller)

```
CLIENT (Postman, Frontend, cURL)
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  app.js — Global Middleware                                 │
│  cors() → express.json() → incoming request log            │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  routes/index.js — Main Router                              │
│  /api/auth/*  → authRoutes.js                               │
│  /api/users/* → userRoutes.js                               │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Per-Route Middleware Chain                                  │
│  sanitizeInput → validators → handleValidationErrors        │
│  (+ authenticateToken on private routes)                    │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Controllers — Business Logic                               │
│  authController: register(), login()                        │
│  userController: getProfile(), updateProfile(), deleteProfile() │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Models — DB Interaction via Sequelize                      │
│  User.create(), User.findOne(), user.update(), user.destroy()│
│  Hooks: beforeCreate → bcrypt.hash()                        │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  MySQL — Database                                            │
│  Table: users (id, name, email, password, createdAt, updatedAt) │
└─────────────────────────────────────────────────────────────┘
```

### 🔍 Detailed request flow (example: POST /api/auth/register)

```
1. [APP]             → POST /api/auth/register from ::1
2. [SANITIZE]        Fields received: name, email, password → Sanitized data
3. [VALIDATION]      Verifying data → ✓ Valid data
4. [CONTROLLER:Auth] Data received → name: John, email: john@mail.com
5. [MODEL:User]      Hook beforeCreate → Encrypting password
6. [CONTROLLER:Auth] ✓ User registered → id: 1, email: john@mail.com
```

---

## 🔀 Routing System

### How routes are built

Routing is resolved in **3 levels** that chain together to form the final URL:

```
app.js                    → Base prefix:    /api
  └── routes/index.js     → Groups modules: /api/auth/*   and   /api/users/*
        ├── authRoutes.js → Defines endpoints: /register, /login
        └── userRoutes.js → Defines endpoints: /profile (GET, PUT, DELETE)
```

**Final result:**
| File | Defines | Full URL |
|------|---------|----------|
| app.js | `app.use('/api', apiRoutes)` | `/api/...` |
| routes/index.js | `router.use('/auth', authRoutes)` | `/api/auth/...` |
| routes/index.js | `router.use('/users', userRoutes)` | `/api/users/...` |
| authRoutes.js | `router.post('/register', ...)` | `POST /api/auth/register` |
| authRoutes.js | `router.post('/login', ...)` | `POST /api/auth/login` |
| userRoutes.js | `router.get('/profile', ...)` | `GET /api/users/profile` |
| userRoutes.js | `router.put('/profile', ...)` | `PUT /api/users/profile` |
| userRoutes.js | `router.delete('/profile', ...)` | `DELETE /api/users/profile` |

### Per-route middleware chain

Each route passes through a middleware chain before reaching the controller:

**Public routes** (authRoutes.js):
```
sanitizeInput → registerValidation/loginValidation → handleValidationErrors → controller
```

**Private routes** (userRoutes.js):
```
authenticateToken (global) → sanitizeInput → updateProfileValidation → handleValidationErrors → controller
```

> `authenticateToken` is applied to **all** userRoutes with `router.use(authenticateToken)`, so it is not repeated on each endpoint.

---

## 🗃️ Data Model

### 📋 `users` Table

| Field | Type | Constraints | Source | Description |
|-------|------|-------------|--------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Sequelize (automatic) | Unique identifier |
| `name` | STRING | NOT NULL | User.js | User's name |
| `email` | STRING | NOT NULL, UNIQUE | User.js | User's unique email |
| `password` | STRING | NOT NULL | User.js | Password hashed with bcrypt |
| `createdAt` | DATETIME | AUTO | Sequelize (`timestamps: true`) | Creation date |
| `updatedAt` | DATETIME | AUTO | Sequelize (`timestamps: true`) | Last modification date |

The table is created automatically with `sequelize.sync()` on server start. It is only created if it does not exist; data persists across restarts.

### User model methods

| Method | Type | Description |
|--------|------|-------------|
| `comparePassword(password)` | Instance | Compares plain text password with stored hash using bcrypt |
| `toJSON()` | Instance | Serializes the user **excluding** the password field from JSON responses |
| `init(sequelize)` | Static | Defines the model schema, table, and hooks |

### `beforeCreate` Hook
When creating a user with `User.create()`, the hook automatically hashes the password with bcrypt (10 salt rounds) **before** saving it to the DB.

---

## 🚀 API Endpoints

### 🌐 Base URL: `http://localhost:3000/api`

### 📝 Public Routes (No authentication required)

#### 1. User Registration
- **URL:** `POST /api/auth/register`
- **Chain:** `sanitizeInput → registerValidation → handleValidationErrors → register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Pass123"
  }
  ```
- **Validations:**
  - `name`: required, 2-50 characters, letters and spaces only
  - `email`: required, valid email format, max 100 characters
  - `password`: min 6 characters, must contain 1 lowercase, 1 uppercase, and 1 number
- **Success response (201):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-03-11T10:30:00.000Z",
      "updatedAt": "2026-03-11T10:30:00.000Z"
    }
  }
  ```

#### 2. Login
- **URL:** `POST /api/auth/login`
- **Chain:** `sanitizeInput → loginValidation → handleValidationErrors → login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "Pass123"
  }
  ```
- **Validations:**
  - `email`: required, valid email format
  - `password`: required
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### 🔒 Private Routes (JWT token required)

**Required header on all:** `Authorization: Bearer <token>`

> All routes under `/api/users/*` first pass through `authenticateToken`, which verifies the JWT and attaches `req.user` with the authenticated user's data.

#### 3. View Profile
- **URL:** `GET /api/users/profile`
- **Chain:** `authenticateToken → getProfile`
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-03-11T10:30:00.000Z",
      "updatedAt": "2026-03-11T10:30:00.000Z"
    }
  }
  ```

#### 4. Update Profile
- **URL:** `PUT /api/users/profile`
- **Chain:** `authenticateToken → sanitizeInput → updateProfileValidation → handleValidationErrors → updateProfile`
- **Body** (all fields are optional):
  ```json
  {
    "name": "John C. Doe",
    "email": "johnc@example.com"
  }
  ```
- **Validations** (only sent fields are validated):
  - `name`: 2-50 characters, letters and spaces only
  - `email`: valid email format, max 100 characters, must not be in use by another user
  - `password`: min 6 characters, 1 lowercase, 1 uppercase, and 1 number
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "user": {
      "id": 1,
      "name": "John C. Doe",
      "email": "johnc@example.com"
    }
  }
  ```

#### 5. Delete Account
- **URL:** `DELETE /api/users/profile`
- **Chain:** `authenticateToken → deleteProfile`
- **Success response (200):**
  ```json
  {
    "success": true,
    "message": "Account deleted successfully",
    "deletedUser": {
      "id": 1,
      "name": "John C. Doe",
      "email": "johnc@example.com",
      "deletedAt": "2026-03-11T11:00:00.000Z"
    }
  }
  ```

### ❌ Error Responses

| Code | Scenario | Example message |
|------|----------|-----------------|
| 400 | Validation failed | `"Validation errors in submitted data"` |
| 401 | No token / invalid token / expired token | `"Access token required"` |
| 401 | Wrong credentials | `"Invalid credentials"` |
| 404 | User not found | `"User not found"` |
| 409 | Duplicate email | `"Resource already exists"` / `"Email already in use"` |
| 500 | Internal error | `"Internal server error"` |

---

## 🔐 Authentication System

### 🎫 JSON Web Tokens (JWT)

#### Authentication Flow:

```
1. POST /api/auth/login  → Valid credentials → JWT generated (expires in 24h)
2. Client stores the token (localStorage, sessionStorage, cookie)
3. Each request to private route → Header: Authorization: Bearer <token>
4. authMiddleware verifies → Valid token → req.user = user from DB → access granted
```

#### Token Structure:
```javascript
// JWT Payload (what it contains)
{
  "userId": 1,        // User ID in the DB
  "iat": 1647842400,  // Creation date (automatic)
  "exp": 1647928800   // Expiration date: 24h later (automatic)
}
```

#### Generation (authController.js):
```javascript
jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
```

#### Verification (authMiddleware.js):
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findByPk(decoded.userId);
req.user = user;  // Available in controllers
```

### 🔒 Password Security

1. **Registration** → `beforeCreate` hook hashes the password with bcrypt (10 salt rounds)
2. **Login** → `user.comparePassword()` compares the stored hash with the entered password
3. **Responses** → `toJSON()` removes the `password` field from all JSON responses
4. The password is **never** stored or transmitted in plain text

---

## 🛠️ Implemented Middleware

### 1. authMiddleware.js — JWT Verification
- Extracts the token from the `Authorization: Bearer <token>` header
- Verifies signature and expiration with `jwt.verify()`
- Looks up the user in DB with `User.findByPk(decoded.userId)`
- Attaches `req.user` and `req.userId` for use in controllers
- Handles specific errors: `JsonWebTokenError`, `TokenExpiredError`

### 2. validation.js — Validation and Sanitization
- **`sanitizeInput()`**: Applies `.trim()` to all string fields in the body
- **`handleValidationErrors()`**: Evaluates express-validator results and returns detailed errors (field, message, value, location)

### 3. errorHandler.js — Centralized Error Handling
Catches all errors arriving via `next(error)` and classifies them:

| Error Type | HTTP Code | Description |
|------------|-----------|-------------|
| `SequelizeValidationError` | 400 | Model validation failed |
| `SequelizeUniqueConstraintError` | 409 | Duplicate email |
| `SequelizeEmptyResultError` | 404 | Record not found |
| `SequelizeConnectionError` | 503 | DB connection error |
| `JsonWebTokenError` | 401 | Invalid token |
| `TokenExpiredError` | 401 | Expired token |
| `entity.parse.failed` | 400 | Malformed JSON |

All error responses have a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "timestamp": "2026-03-11T10:30:00.000Z",
  "path": "/api/auth/register",
  "method": "POST"
}
```

---

## 📋 Logging System

Each project layer records logs with an identifying prefix to facilitate flow tracking:

| Prefix | File | What it logs |
|--------|------|--------------|
| `[SERVER]` | server.js | Startup sequence (4 steps), critical errors |
| `[APP]` | app.js | Incoming requests (`→ METHOD /url from IP`) |
| `[DATABASE]` | database.js | Connection, table synchronization |
| `[MODELS]` | models/index.js | Model initialization |
| `[MODEL:User]` | User.js | Schema definition, hooks (encryption) |
| `[ROUTES]` | routes/index.js | Main route registration |
| `[AUTH]` | authMiddleware.js | Token verification, authenticated user |
| `[SANITIZE]` | validation.js | Fields received, data cleanup |
| `[VALIDATION]` | validation.js | Validation result (✓ valid / ✗ errors) |
| `[CONTROLLER:Auth]` | authController.js | User registration and login |
| `[CONTROLLER:User]` | userController.js | Profile CRUD operations |
| `[ERROR HANDLER]` | errorHandler.js | Captured errors (type, message, path) |

### Startup log example:
```
[DATABASE] Configuring Sequelize connection...
[MODELS]   Initializing User model...
[MODEL:User] Schema defined: name, email, password → table "users"
[MODELS]   User model registered in Sequelize
[ROUTES]   ✓ /api/auth/* → authRoutes
[ROUTES]   ✓ /api/users/* → userRoutes
[APP]      Express instance created
[SERVER]   Step 1/4: Connecting to database...
[DATABASE] Attempting to connect to localhost:3306/api_restful...
[DATABASE] ✅ MySQL connection established successfully
[SERVER]   Step 2/4: Initializing models...
[SERVER]   Step 3/4: Synchronizing database...
[DATABASE] ✅ Tables synchronized successfully
[SERVER]   Step 4/4: Database system fully initialized
🚀 Server running on port 3000
```

### Request log example (POST /register):
```
[APP]             → POST /api/auth/register from ::1
[SANITIZE]        Fields received: name, email, password
[SANITIZE]        ✓ Data sanitized
[VALIDATION]      ✓ Valid data, continuing...
[CONTROLLER:Auth] Data received → name: John, email: john@mail.com
[CONTROLLER:Auth] Creating user in DB...
[MODEL:User]      Hook beforeCreate → Encrypting password for: john@mail.com
[MODEL:User]      Password encrypted successfully
[CONTROLLER:Auth] ✓ User registered → id: 1, email: john@mail.com
```

---

## 💾 Configuration

### 📋 `.env` File
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=api_restful
DB_PORT=3306
JWT_SECRET=random_string_generated_with_crypto  # Minimum 32 characters
PORT=3000
```

> **Generate JWT_SECRET:** `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### ⚙️ Sequelize Configuration (database.js)
```javascript
const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'api_restful',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: { timestamps: true, underscored: false },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});
```

### 📦 Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | HTTP framework |
| sequelize | ^6.37.8 | MySQL ORM |
| mysql2 | ^3.19.1 | MySQL driver |
| jsonwebtoken | ^9.0.3 | JWT generation/verification |
| bcrypt | ^6.0.0 | Password hashing |
| cors | ^2.8.6 | Cross-origin requests |
| dotenv | ^17.3.1 | Environment variables |
| express-validator | ^7.3.1 | Data validation and sanitization |
| nodemon | ^3.1.14 | Auto-restart in development (devDependency) |

---

## 🚀 Commands

```bash
npm install         # Install dependencies
npm start           # Run server (node src/server.js)
npm run dev         # Run with nodemon (auto-restart on file save)
```

**Prerequisite:** Create the database in MySQL before starting:
```sql
CREATE DATABASE api_restful;
```

---

## 🧪 How to Test the API

### With Postman / Thunder Client

#### 1. Register:
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Pass123"
}
```

#### 2. Login → copy the token from the response:
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Pass123"
}
```

#### 3. View Profile (use the obtained token):
```
GET http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOi...
```

#### 4. Update Profile:
```
PUT http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{
  "name": "John C. Doe"
}
```

#### 5. Delete Account:
```
DELETE http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOi...
```

### With PowerShell
```powershell
# Register
$body = @{name="John"; email="john@mail.com"; password="Pass123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -ContentType "application/json"

# Login
$body = @{email="john@mail.com"; password="Pass123"} | ConvertTo-Json
$res = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $res.token

# View Profile
Invoke-RestMethod -Uri "http://localhost:3000/api/users/profile" -Method GET -Headers @{Authorization="Bearer $token"}
```

---

## 📝 Implemented Features

- ✅ **MVC Pattern** with clear separation of concerns
- ✅ **ES6 Modules** (import/export) with `"type": "module"` in package.json
- ✅ **Async/Await** in all asynchronous operations
- ✅ **Robust validation** with express-validator (schemas per endpoint)
- ✅ **Automatic sanitization** of input data (trim)
- ✅ **Centralized error handling** with classification by type
- ✅ **JWT Authentication** with 24-hour expiration
- ✅ **bcrypt hashing** with 10 salt rounds
- ✅ **Detailed logging system** per layer with identifying prefixes
- ✅ **CORS** enabled for cross-origin requests
- ✅ **MySQL connection pool** optimized (max: 5)
- ✅ **Safe DB synchronization** (`sync()` without `force`, preserves data)
