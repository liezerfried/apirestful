# DOCUMENTATION - RESTful Users API

RESTful API built with **Node.js**, **Express 5**, **MySQL**, and **Sequelize** for user management with JWT authentication.

---

## Project Structure

```
src/
├── app.js                  ← Express config (middleware, routes, view engine)
├── server.js               ← Entry point: DB connection + HTTP server startup
├── config/database.js      ← Sequelize connection (reads .env)
├── controllers/
│   ├── authController.js   ← register(), login()
│   └── userController.js   ← getProfile(), updateProfile(), deleteProfile()
├── middleware/
│   ├── authMiddleware.js   ← JWT verification on protected routes
│   ├── errorHandler.js     ← Centralized error handling
│   └── validation.js       ← sanitizeInput(), handleValidationErrors()
├── models/
│   ├── User.js             ← Sequelize model (schema, bcrypt hook, toJSON)
│   └── index.js            ← Exports all models
├── routes/
│   ├── index.js            ← Mounts /auth and /users under /api
│   ├── authRoutes.js       ← POST /register, POST /login
│   └── userRoutes.js       ← GET/PUT/DELETE /profile (JWT required)
├── utils/validators.js     ← express-validator rule sets
├── views/index.ejs         ← EJS test panel
└── public/css/styles.css
```

---

## API Endpoints

**Base URL:** `http://localhost:{PORT}/api`

### Public Routes

#### POST /api/auth/register
```json
// Body
{ "name": "John Doe", "email": "john@example.com", "password": "Pass123" }

// 201 Response
{ "success": true, "message": "User registered successfully", "user": { "id": 1, "name": "John Doe", "email": "john@example.com" } }
```
Validations: name (2-50 chars, letters/spaces), email (valid format), password (min 6, 1 upper, 1 lower, 1 number).

#### POST /api/auth/login
```json
// Body
{ "email": "john@example.com", "password": "Pass123" }

// 200 Response
{ "success": true, "token": "eyJhbGci...", "user": { "id": 1, "name": "John Doe", "email": "john@example.com" } }
```

### Private Routes

**Required header:** `Authorization: Bearer <token>`

All `/api/users/*` routes run through `authenticateToken` before the controller.

#### GET /api/users/profile
Returns the authenticated user's profile (no body needed).

#### PUT /api/users/profile
```json
// Body (all fields optional)
{ "name": "John C. Doe", "email": "johnc@example.com" }
```
Same validations as register. Email must not be in use by another user.

#### DELETE /api/users/profile
Deletes the authenticated user's account (no body needed).

### Error Responses

| Code | Scenario |
|------|----------|
| 400  | Validation failed / malformed JSON |
| 401  | Missing, invalid, or expired token / wrong credentials |
| 404  | User not found |
| 409  | Email already in use |
| 500  | Internal server error |

All errors follow this format:
```json
{ "success": false, "message": "...", "statusCode": 400, "timestamp": "...", "path": "/api/...", "method": "POST" }
```

---

## Authentication

JWT flow:
1. `POST /api/auth/login` → valid credentials → JWT issued (24h expiry)
2. Client sends `Authorization: Bearer <token>` on every private request
3. `authMiddleware` verifies token → attaches `req.user` → request proceeds

Token payload: `{ userId, iat, exp }`

Password security: hashed on `beforeCreate` hook (bcrypt, 10 rounds) · compared via `user.comparePassword()` · never returned in responses (`toJSON()` removes it).

---

## Middleware

| File | Responsibility |
|------|---------------|
| `authMiddleware.js` | Extracts + verifies JWT, attaches `req.user` / `req.userId` |
| `validation.js` | `sanitizeInput` (trim all strings), `handleValidationErrors` (returns field-level errors) |
| `errorHandler.js` | Maps Sequelize/JWT error types to HTTP status codes, unified response format |

---

## Logging

Each layer prefixes its logs for easy tracing:

| Prefix | Layer |
|--------|-------|
| `[SERVER]` | Startup sequence |
| `[APP]` | Incoming requests |
| `[DATABASE]` | DB connection/sync |
| `[MODELS]` | Model initialization |
| `[ROUTES]` | Route registration |
| `[AUTH]` | Token verification |
| `[SANITIZE]` / `[VALIDATION]` | Input processing |
| `[CONTROLLER:Auth]` / `[CONTROLLER:User]` | Business logic |
| `[ERROR HANDLER]` | Caught errors |

---

## Configuration

**.env**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=api_restful
DB_PORT=3306
JWT_SECRET=your_64char_hex_string
PORT=3000
```
Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

**Commands**
```bash
npm install      # Install dependencies
npm start        # Run server
npm run dev      # Run with nodemon (auto-restart)
```

---

## Testing with Postman / Thunder Client

```
POST   /api/auth/register    → create account
POST   /api/auth/login       → get token
GET    /api/users/profile    → view profile    (Bearer token)
PUT    /api/users/profile    → update profile  (Bearer token)
DELETE /api/users/profile    → delete account  (Bearer token)
```
