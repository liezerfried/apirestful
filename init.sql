-- Este script crea la base de datos 'apirestful' y la tabla 'users' necesaria para la API RESTful.
-- Ejecuta este archivo antes de iniciar la aplicación para asegurar que la estructura de la base de datos esté lista.

CREATE DATABASE IF NOT EXISTS apirestful;
USE apirestful;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,         -- Identificador único y autoincremental para cada usuario
  name VARCHAR(100) NOT NULL,                -- Nombre del usuario
  email VARCHAR(100) NOT NULL UNIQUE,        -- Correo electrónico único del usuario
  password VARCHAR(255) NOT NULL,            -- Contraseña hasheada del usuario
  createdAt DATETIME NOT NULL,               -- Fecha de creación del registro
  updatedAt DATETIME NOT NULL                -- Fecha de última actualización del registro
);