# RESTful API - User Management

A RESTful API built with Node.js and Express for user management with JWT authentication, MySQL, and Sequelize.

## Features

- User registration, login, and JWT token retrieval
- View, update, and delete authenticated user profile
- Passwords hashed with bcrypt
- Input validation and sanitization

## Technologies

Node.js · Express · MySQL · Sequelize · JWT · bcrypt · express-validator · EJS

## Architecture

Layered MVC: controllers (business logic), models (data), routes (endpoints), middleware (processing).

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 24h expiration
- Input validation and sanitization on all endpoints
- Password field excluded from all JSON responses

## Setup

1. Run `init.sql` on your MySQL server to create the database and table:
   ```
   mysql -u your_user -p < init.sql
   ```
2. Copy `.env.example` to `.env` and fill in your credentials:
   ```
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=api_restful
   JWT_SECRET=your_secret_key
   PORT=3000
   ```
3. Install dependencies: `npm install`
4. Start the server: `npm run dev`
5. Open `http://localhost:3000` to access the EJS test panel.
