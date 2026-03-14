# API RESTful - Gestión de Usuarios

## Descripción

Este proyecto es una API RESTful desarrollada con Node.js y Express que permite gestionar usuarios con un sistema de autenticación basado en JSON Web Tokens (JWT). Utiliza MySQL como base de datos y Sequelize como ORM.

El objetivo principal es proporcionar una estructura base para aplicaciones que requieran registro de usuarios, inicio de sesión y gestión de perfiles, siguiendo buenas prácticas de seguridad y organización de código.

## Funcionalidades

- Registro de usuarios (nombre, correo electrónico y contraseña).
- Inicio de sesión y obtención de token JWT.
- Consulta, actualización y eliminación de perfil de usuario autenticado.
- Contraseñas almacenadas de forma segura con bcrypt.
- Validación y sanitización de entradas de usuario.

## Tecnologías utilizadas

- Node.js y Express
- MySQL y Sequelize
- JWT (jsonwebtoken)
- bcrypt
- express-validator
- EJS (panel de pruebas visual)

## Arquitectura

El código sigue una arquitectura por capas: controladores (lógica de negocio), modelos (estructura de datos), rutas (endpoints) y middlewares (procesamiento de peticiones).

## Seguridad

- Contraseñas hasheadas con bcrypt.
- Tokens JWT con expiración y clave secreta.
- Validación y sanitización de datos de entrada.
- El campo de contraseña no se expone en las respuestas JSON.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (puedes copiar el archivo `.env.example` como base) y completa los siguientes valores:

```
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=apirestful
JWT_SECRET=tu_clave_secreta
```

## Creación de la base de datos

Ejecuta el archivo `init.sql` incluido en la raíz del proyecto en tu servidor MySQL para crear la base de datos y la tabla de usuarios:

```sql
CREATE DATABASE IF NOT EXISTS apirestful;
USE apirestful;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

## Pasos para probar el panel EJS

1. Ejecuta el archivo `init.sql` en tu servidor MySQL.
2. Configura el archivo `.env` con los datos de tu base de datos.
3. Instala las dependencias con `npm install`.
4. Inicia la aplicación con `npm run dev`.
5. Accede al panel visual (EJS) en tu navegador y prueba los formularios.

---

**Nota:** Si tienes dudas sobre cómo ejecutar el archivo SQL, puedes usar herramientas como MySQL Workbench o el comando `mysql` en terminal:

```
mysql -u usuario -p < init.sql
```