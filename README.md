# RESTful API - User Management

## Description

This project is a RESTful API built with Node.js and Express for managing users with a JWT-based authentication system. It uses MySQL as the database and Sequelize as the ORM.

The main goal is to provide a base structure for applications that require user registration, login, and profile management, following security best practices and clean code organization.

## Features

- User registration (name, email, and password).
- Login and JWT token retrieval.
- Query, update, and delete authenticated user profile.
- Passwords stored securely with bcrypt.
- Input validation and sanitization.

## Technologies used

- Node.js and Express
- MySQL and Sequelize
- JWT (jsonwebtoken)
- bcrypt
- express-validator
- EJS (visual test panel)

## Architecture

The code follows a layered architecture: controllers (business logic), models (data structure), routes (endpoints), and middlewares (request processing).

## Security

- Passwords hashed with bcrypt.
- JWT tokens with expiration and secret key.
- Input data validation and sanitization.
- The password field is not exposed in JSON responses.

## Environment variables

Create a `.env` file in the project root (you can copy `.env.example` as a base) and fill in the following values:

```
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=api_restful
JWT_SECRET=your_secret_key
```

## Database setup

Run the `init.sql` file included in the project root on your MySQL server to create the database and users table:

```sql
CREATE DATABASE IF NOT EXISTS api_restful;
USE api_restful;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

## Steps to test the EJS panel

1. Run the `init.sql` file on your MySQL server.
2. Configure the `.env` file with your database credentials.
3. Install dependencies with `npm install`.
4. Start the application with `npm run dev`.
5. Open the visual panel (EJS) in your browser and test the forms.

---

**Note:** If you are unsure how to run the SQL file, you can use tools like MySQL Workbench or the `mysql` command in the terminal:

```
mysql -u your_user -p < init.sql
```