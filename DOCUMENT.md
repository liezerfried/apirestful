# 📖 DOCUMENTACIÓN - API RESTful de Usuarios

## 🎯 Descripción General
API RESTful desarrollada con **Node.js**, **Express 5**, **MySQL** y **Sequelize** que permite la gestión completa de usuarios con autenticación JWT. Incluye sistema de logging detallado por capas, validación robusta con express-validator y manejo centralizado de errores.

---

## 📁 Estructura del Proyecto

```
📁 apirestful/
├── 📄 package.json            # Configuración del proyecto y dependencias
├── 📄 .env                    # Variables de entorno (BD, JWT, Puerto)
├── 📄 .gitignore              # Archivos excluidos de Git
├── 📄 TASK.md                 # Consigna original del proyecto
├── 📄 DOCUMENT.md             # Esta documentación
│
├── 📁 agents/
│   └── 📄 apiMentorAgent.md   # Agente mentor para desarrollo
│
└── 📁 src/
    ├── 📄 server.js           # Punto de entrada: arranque secuencial del servidor
    ├── 📄 app.js              # Configuración de Express (middleware global, rutas, log de peticiones)
    │
    ├── 📁 config/
    │   └── 📄 database.js     # Conexión Sequelize + MySQL, sync de tablas
    │
    ├── 📁 models/
    │   ├── 📄 index.js        # Centralización y exportación de modelos
    │   └── 📄 User.js         # Modelo User: esquema, hooks (bcrypt), métodos de instancia
    │
    ├── 📁 controllers/
    │   ├── 📄 authController.js   # Lógica de register() y login()
    │   └── 📄 userController.js   # Lógica de getProfile(), updateProfile(), deleteProfile()
    │
    ├── 📁 routes/
    │   ├── 📄 index.js        # Router principal: agrupa /auth y /users bajo /api
    │   ├── 📄 authRoutes.js   # Rutas públicas: POST /register, POST /login
    │   └── 📄 userRoutes.js   # Rutas privadas: GET/PUT/DELETE /profile (requieren JWT)
    │
    ├── 📁 middleware/
    │   ├── 📄 authMiddleware.js   # Verificación y decodificación de JWT
    │   ├── 📄 validation.js       # handleValidationErrors() + sanitizeInput()
    │   └── 📄 errorHandler.js     # Manejo centralizado de errores (Sequelize, JWT, JSON, etc.)
    │
    └── 📁 utils/
        └── 📄 validators.js      # Esquemas de validación con express-validator
```

---

## 🔄 Flujo de Datos de la Aplicación

### 📊 Arquitectura MVC (Model-View-Controller)

```
CLIENTE (Postman, Frontend, cURL)
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  app.js — Middleware Global                                 │
│  cors() → express.json() → log de petición entrante        │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  routes/index.js — Router Principal                         │
│  /api/auth/*  → authRoutes.js                               │
│  /api/users/* → userRoutes.js                               │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Cadena de Middleware por Ruta                               │
│  sanitizeInput → validators → handleValidationErrors        │
│  (+ authenticateToken en rutas privadas)                    │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Controllers — Lógica de Negocio                            │
│  authController: register(), login()                        │
│  userController: getProfile(), updateProfile(), deleteProfile() │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  Models — Interacción con BD via Sequelize                  │
│  User.create(), User.findOne(), user.update(), user.destroy()│
│  Hooks: beforeCreate → bcrypt.hash()                        │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  MySQL — Base de Datos                                       │
│  Tabla: users (id, name, email, password, createdAt, updatedAt) │
└─────────────────────────────────────────────────────────────┘
```

### 🔍 Flujo detallado de una petición (ejemplo: POST /api/auth/register)

```
1. [APP]             → POST /api/auth/register desde ::1
2. [SANITIZE]        Campos recibidos: name, email, password → Datos sanitizados
3. [VALIDATION]      Verificando datos → ✓ Datos válidos
4. [CONTROLLER:Auth] Datos recibidos → name: Juan, email: juan@mail.com
5. [MODEL:User]      Hook beforeCreate → Encriptando contraseña
6. [CONTROLLER:Auth] ✓ Usuario registrado → id: 1, email: juan@mail.com
```

---

## 🔀 Sistema de Ruteo

### Cómo se construyen las rutas

El ruteo se resuelve en **3 niveles** que se encadenan para formar la URL final:

```
app.js                    → Prefijo base:    /api
  └── routes/index.js     → Agrupa módulos:  /api/auth/*   y   /api/users/*
        ├── authRoutes.js → Define endpoints: /register, /login
        └── userRoutes.js → Define endpoints: /profile (GET, PUT, DELETE)
```

**Resultado final:**
| Archivo | Define | URL completa |
|---------|--------|-------------|
| app.js | `app.use('/api', apiRoutes)` | `/api/...` |
| routes/index.js | `router.use('/auth', authRoutes)` | `/api/auth/...` |
| routes/index.js | `router.use('/users', userRoutes)` | `/api/users/...` |
| authRoutes.js | `router.post('/register', ...)` | `POST /api/auth/register` |
| authRoutes.js | `router.post('/login', ...)` | `POST /api/auth/login` |
| userRoutes.js | `router.get('/profile', ...)` | `GET /api/users/profile` |
| userRoutes.js | `router.put('/profile', ...)` | `PUT /api/users/profile` |
| userRoutes.js | `router.delete('/profile', ...)` | `DELETE /api/users/profile` |

### Cadena de middleware por ruta

Cada ruta pasa por una cadena de middleware antes de llegar al controlador:

**Rutas públicas** (authRoutes.js):
```
sanitizeInput → registerValidation/loginValidation → handleValidationErrors → controller
```

**Rutas privadas** (userRoutes.js):
```
authenticateToken (global) → sanitizeInput → updateProfileValidation → handleValidationErrors → controller
```

> `authenticateToken` se aplica a **todas** las rutas de userRoutes con `router.use(authenticateToken)`, por lo que no se repite en cada endpoint.

---

## 🗃️ Modelo de Datos

### 📋 Tabla `users`

| Campo | Tipo | Restricciones | Origen | Descripción |
|-------|------|---------------|--------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Sequelize (automático) | Identificador único |
| `name` | STRING | NOT NULL | User.js | Nombre del usuario |
| `email` | STRING | NOT NULL, UNIQUE | User.js | Email único del usuario |
| `password` | STRING | NOT NULL | User.js | Contraseña hasheada con bcrypt |
| `createdAt` | DATETIME | AUTO | Sequelize (`timestamps: true`) | Fecha de creación |
| `updatedAt` | DATETIME | AUTO | Sequelize (`timestamps: true`) | Fecha de última modificación |

La tabla se crea automáticamente con `sequelize.sync()` al iniciar el servidor. Solo se crea si no existe; los datos persisten entre reinicios.

### Métodos del modelo User

| Método | Tipo | Descripción |
|--------|------|-------------|
| `comparePassword(password)` | Instancia | Compara contraseña en texto plano con el hash almacenado usando bcrypt |
| `toJSON()` | Instancia | Serializa el usuario **excluyendo** el campo password de las respuestas JSON |
| `init(sequelize)` | Estático | Define el esquema, tabla y hooks del modelo |

### Hook `beforeCreate`
Al crear un usuario con `User.create()`, el hook automáticamente hashea la contraseña con bcrypt (10 salt rounds) **antes** de guardarla en la BD.

---

## 🚀 Endpoints de la API

### 🌐 URL Base: `http://localhost:3000/api`

### 📝 Rutas Públicas (No requieren autenticación)

#### 1. Registro de Usuario
- **URL:** `POST /api/auth/register`
- **Cadena:** `sanitizeInput → registerValidation → handleValidationErrors → register`
- **Body:**
  ```json
  {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Pass123"
  }
  ```
- **Validaciones:**
  - `name`: obligatorio, 2-50 caracteres, solo letras y espacios
  - `email`: obligatorio, formato email válido, máximo 100 caracteres
  - `password`: mínimo 6 caracteres, debe contener 1 minúscula, 1 mayúscula y 1 número
- **Respuesta exitosa (201):**
  ```json
  {
    "success": true,
    "message": "Usuario registrado exitosamente",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2026-03-11T10:30:00.000Z",
      "updatedAt": "2026-03-11T10:30:00.000Z"
    }
  }
  ```

#### 2. Inicio de Sesión
- **URL:** `POST /api/auth/login`
- **Cadena:** `sanitizeInput → loginValidation → handleValidationErrors → login`
- **Body:**
  ```json
  {
    "email": "juan@example.com",
    "password": "Pass123"
  }
  ```
- **Validaciones:**
  - `email`: obligatorio, formato email válido
  - `password`: obligatorio
- **Respuesta exitosa (200):**
  ```json
  {
    "success": true,
    "message": "Login exitoso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  }
  ```

### 🔒 Rutas Privadas (Requieren token JWT)

**Header requerido en todas:** `Authorization: Bearer <token>`

> Todas las rutas de `/api/users/*` pasan primero por `authenticateToken`, que verifica el JWT y adjunta `req.user` con los datos del usuario autenticado.

#### 3. Ver Perfil
- **URL:** `GET /api/users/profile`
- **Cadena:** `authenticateToken → getProfile`
- **Respuesta exitosa (200):**
  ```json
  {
    "success": true,
    "message": "Perfil obtenido exitosamente",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2026-03-11T10:30:00.000Z",
      "updatedAt": "2026-03-11T10:30:00.000Z"
    }
  }
  ```

#### 4. Actualizar Perfil
- **URL:** `PUT /api/users/profile`
- **Cadena:** `authenticateToken → sanitizeInput → updateProfileValidation → handleValidationErrors → updateProfile`
- **Body** (todos los campos son opcionales):
  ```json
  {
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com"
  }
  ```
- **Validaciones** (solo se validan los campos enviados):
  - `name`: 2-50 caracteres, solo letras y espacios
  - `email`: formato email válido, máximo 100 caracteres, no debe estar en uso por otro usuario
  - `password`: mínimo 6 caracteres, 1 minúscula, 1 mayúscula y 1 número
- **Respuesta exitosa (200):**
  ```json
  {
    "success": true,
    "message": "Perfil actualizado exitosamente",
    "user": {
      "id": 1,
      "name": "Juan Carlos Pérez",
      "email": "juancarlos@example.com"
    }
  }
  ```

#### 5. Eliminar Cuenta
- **URL:** `DELETE /api/users/profile`
- **Cadena:** `authenticateToken → deleteProfile`
- **Respuesta exitosa (200):**
  ```json
  {
    "success": true,
    "message": "Cuenta eliminada exitosamente",
    "deletedUser": {
      "id": 1,
      "name": "Juan Carlos Pérez",
      "email": "juancarlos@example.com",
      "deletedAt": "2026-03-11T11:00:00.000Z"
    }
  }
  ```

### ❌ Respuestas de Error

| Código | Escenario | Ejemplo de mensaje |
|--------|-----------|-------------------|
| 400 | Validación fallida | `"Errores de validación en los datos enviados"` |
| 401 | Sin token / token inválido / token expirado | `"Token de acceso requerido"` |
| 401 | Credenciales incorrectas | `"Credenciales inválidas"` |
| 404 | Usuario no encontrado | `"Usuario no encontrado"` |
| 409 | Email duplicado | `"Recurso ya existe"` / `"El email ya está en uso"` |
| 500 | Error interno | `"Error interno del servidor"` |

---

## 🔐 Sistema de Autenticación

### 🎫 JSON Web Tokens (JWT)

#### Flujo de Autenticación:

```
1. POST /api/auth/login  → Credenciales válidas → Se genera JWT (expira en 24h)
2. Cliente guarda el token (localStorage, sessionStorage, cookie)
3. Cada petición a ruta privada → Header: Authorization: Bearer <token>
4. authMiddleware verifica → Token válido → req.user = usuario de BD → acceso permitido
```

#### Estructura del Token:
```javascript
// Payload del JWT (lo que contiene)
{
  "userId": 1,        // ID del usuario en la BD
  "iat": 1647842400,  // Fecha de creación (automático)
  "exp": 1647928800   // Fecha de expiración: 24h después (automático)
}
```

#### Generación (authController.js):
```javascript
jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
```

#### Verificación (authMiddleware.js):
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findByPk(decoded.userId);
req.user = user;  // Disponible en los controladores
```

### 🔒 Seguridad de Contraseñas

1. **Registro** → `beforeCreate` hook hashea la contraseña con bcrypt (10 salt rounds)
2. **Login** → `user.comparePassword()` compara el hash almacenado con la contraseña ingresada
3. **Respuestas** → `toJSON()` elimina el campo `password` de todas las respuestas JSON
4. **Nunca** se almacena ni transmite la contraseña en texto plano

---

## 🛠️ Middleware Implementados

### 1. authMiddleware.js — Verificación JWT
- Extrae el token del header `Authorization: Bearer <token>`
- Verifica firma y expiración con `jwt.verify()`
- Busca al usuario en BD con `User.findByPk(decoded.userId)`
- Adjunta `req.user` y `req.userId` para uso en controladores
- Maneja errores específicos: `JsonWebTokenError`, `TokenExpiredError`

### 2. validation.js — Validación y Sanitización
- **`sanitizeInput()`**: Hace `.trim()` a todos los campos string del body
- **`handleValidationErrors()`**: Evalúa los resultados de express-validator y devuelve errores detallados (campo, mensaje, valor, ubicación)

### 3. errorHandler.js — Manejo Centralizado de Errores
Captura todos los errores que llegan via `next(error)` y los clasifica:

| Tipo de Error | Código HTTP | Descripción |
|--------------|-------------|-------------|
| `SequelizeValidationError` | 400 | Validación de modelo fallida |
| `SequelizeUniqueConstraintError` | 409 | Email duplicado |
| `SequelizeEmptyResultError` | 404 | Registro no encontrado |
| `SequelizeConnectionError` | 503 | Error de conexión a BD |
| `JsonWebTokenError` | 401 | Token inválido |
| `TokenExpiredError` | 401 | Token expirado |
| `entity.parse.failed` | 400 | JSON malformado |

Todas las respuestas de error tienen formato consistente:
```json
{
  "success": false,
  "message": "Descripción del error",
  "statusCode": 400,
  "timestamp": "2026-03-11T10:30:00.000Z",
  "path": "/api/auth/register",
  "method": "POST"
}
```

---

## 📋 Sistema de Logging

Cada capa del proyecto registra logs con un prefijo identificador para facilitar el seguimiento del flujo:

| Prefijo | Archivo | Qué registra |
|---------|---------|-------------|
| `[SERVER]` | server.js | Secuencia de arranque (4 pasos), errores críticos |
| `[APP]` | app.js | Peticiones entrantes (`→ METHOD /url desde IP`) |
| `[DATABASE]` | database.js | Conexión, sincronización de tablas |
| `[MODELS]` | models/index.js | Inicialización de modelos |
| `[MODEL:User]` | User.js | Definición de esquema, hooks (encriptación) |
| `[ROUTES]` | routes/index.js | Registro de rutas principales |
| `[AUTH]` | authMiddleware.js | Verificación de token, usuario autenticado |
| `[SANITIZE]` | validation.js | Campos recibidos, limpieza de datos |
| `[VALIDATION]` | validation.js | Resultado de validaciones (✓ válido / ✗ errores) |
| `[CONTROLLER:Auth]` | authController.js | Registro y login de usuarios |
| `[CONTROLLER:User]` | userController.js | Operaciones CRUD de perfil |
| `[ERROR HANDLER]` | errorHandler.js | Errores capturados (tipo, mensaje, ruta) |

### Ejemplo de log de arranque:
```
[DATABASE] Configurando conexión Sequelize...
[MODELS]   Inicializando modelo User...
[MODEL:User] Esquema definido: name, email, password → tabla "users"
[MODELS]   Modelo User registrado en Sequelize
[ROUTES]   ✓ /api/auth/* → authRoutes
[ROUTES]   ✓ /api/users/* → userRoutes
[APP]      Instancia de Express creada
[SERVER]   Paso 1/4: Conectando a la base de datos...
[DATABASE] Intentando conectar a localhost:3306/api_restful...
[DATABASE] ✅ Conexión a MySQL establecida correctamente
[SERVER]   Paso 2/4: Inicializando modelos...
[SERVER]   Paso 3/4: Sincronizando base de datos...
[DATABASE] ✅ Tablas sincronizadas correctamente
[SERVER]   Paso 4/4: Sistema de base de datos completamente inicializado
🚀 Servidor corriendo en puerto 3000
```

### Ejemplo de log de petición (POST /register):
```
[APP]             → POST /api/auth/register desde ::1
[SANITIZE]        Campos recibidos: name, email, password
[SANITIZE]        ✓ Datos sanitizados
[VALIDATION]      ✓ Datos válidos, continuando...
[CONTROLLER:Auth] Datos recibidos → name: Juan, email: juan@mail.com
[CONTROLLER:Auth] Creando usuario en BD...
[MODEL:User]      Hook beforeCreate → Encriptando contraseña para: juan@mail.com
[MODEL:User]      Contraseña encriptada correctamente
[CONTROLLER:Auth] ✓ Usuario registrado → id: 1, email: juan@mail.com
```

---

## 💾 Configuración

### 📋 Archivo `.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=api_restful
DB_PORT=3306
JWT_SECRET=cadena_aleatoria_generada_con_crypto  # Mínimo 32 caracteres
PORT=3000
```

> **Generar JWT_SECRET:** `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### ⚙️ Configuración Sequelize (database.js)
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

### 📦 Dependencias
| Paquete | Versión | Propósito |
|---------|---------|-----------|
| express | ^5.2.1 | Framework HTTP |
| sequelize | ^6.37.8 | ORM para MySQL |
| mysql2 | ^3.19.1 | Driver MySQL |
| jsonwebtoken | ^9.0.3 | Generación/verificación JWT |
| bcrypt | ^6.0.0 | Hashing de contraseñas |
| cors | ^2.8.6 | Peticiones cross-origin |
| dotenv | ^17.3.1 | Variables de entorno |
| express-validator | ^7.3.1 | Validación y sanitización de datos |
| nodemon | ^3.1.14 | Auto-restart en desarrollo (devDependency) |

---

## 🚀 Comandos

```bash
npm install         # Instalar dependencias
npm start           # Ejecutar servidor (node src/server.js)
npm run dev         # Ejecutar con nodemon (auto-restart al guardar cambios)
```

**Prerequisito:** Crear la base de datos en MySQL antes de iniciar:
```sql
CREATE DATABASE api_restful;
```

---

## 🧪 Cómo Probar la API

### Con Postman / Thunder Client

#### 1. Registro:
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Pass123"
}
```

#### 2. Login → copiar el token de la respuesta:
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Pass123"
}
```

#### 3. Ver Perfil (usar el token obtenido):
```
GET http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOi...
```

#### 4. Actualizar Perfil:
```
PUT http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{
  "name": "Juan Carlos Pérez"
}
```

#### 5. Eliminar Cuenta:
```
DELETE http://localhost:3000/api/users/profile
Authorization: Bearer eyJhbGciOi...
```

### Con PowerShell
```powershell
# Registro
$body = @{name="Juan"; email="juan@mail.com"; password="Pass123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -ContentType "application/json"

# Login
$body = @{email="juan@mail.com"; password="Pass123"} | ConvertTo-Json
$res = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $res.token

# Ver Perfil
Invoke-RestMethod -Uri "http://localhost:3000/api/users/profile" -Method GET -Headers @{Authorization="Bearer $token"}
```

---

## 📝 Características Implementadas

- ✅ **Patrón MVC** con separación clara de responsabilidades
- ✅ **ES6 Modules** (import/export) con `"type": "module"` en package.json
- ✅ **Async/Await** en todas las operaciones asíncronas
- ✅ **Validación robusta** con express-validator (esquemas por endpoint)
- ✅ **Sanitización** automática de datos de entrada (trim)
- ✅ **Manejo centralizado de errores** con clasificación por tipo
- ✅ **Autenticación JWT** con expiración de 24 horas
- ✅ **Hashing bcrypt** con 10 salt rounds
- ✅ **Sistema de logging** detallado por capas con prefijos identificadores
- ✅ **CORS** habilitado para peticiones cross-origin
- ✅ **Pool de conexiones** MySQL optimizado (max: 5)
- ✅ **Sincronización segura** de BD (`sync()` sin `force`, preserva datos)