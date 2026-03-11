Consigna del Trabajo Final del Módulo 4: Desarrollo de una API RESTful
con Node.js y Express
Objetivo
El objetivo de este trabajo final es que los estudiantes apliquen todos los
conocimientos adquiridos en el módulo para desarrollar una API RESTful
funcional utilizando Node.js, Express, y MySQL. La API deberá permitir la
gestión de un sistema básico de usuarios, incluyendo la creación, obtención,
actualización, y eliminación de usuarios. Además, se implementará
autenticación mediante JWT para proteger las rutas privadas.
Descripción del Proyecto
Se debe crear una API RESTful que permita realizar operaciones CRUD
(Crear, Leer, Actualizar, Eliminar) sobre usuarios, y proteger algunas rutas
mediante autenticación utilizando JWT. La API debe incluir las siguientes
funcionalidades:
● Registro de usuarios: Crear un nuevo usuario con nombre, correo
electrónico y contraseña (utilizando hashing de contraseñas).
● Inicio de sesión: Autenticación de usuarios mediante correo electrónico
y contraseña, y generación de un token JWT.
● CRUD de usuarios: Permitir la actualización y eliminación de los datos
del usuario autenticado.
● Rutas protegidas: Solo los usuarios autenticados deben poder acceder
a ciertas rutas (por ejemplo, actualizar o eliminar su información).
La base de datos será MySQL, y se utilizará Sequelize como ORM para
interactuar con la base de datos.
Requisitos Técnicos
1. Configuración del Proyecto
o Utilizar Node.js y Express para crear el servidor y las rutas.
o Usar MySQL como base de datos, conectándose con la librería
Sequelize.
o Configurar un sistema de autenticación utilizando JWT para
proteger rutas privadas.
2. Estructura del Proyecto
o Rutas: Crear rutas para el registro, inicio de sesión, y el manejo
de usuarios. Debe haber rutas públicas (registro, inicio de sesión)
y privadas (actualización y eliminación de usuarios).

o Controladores: Implementar controladores para cada una de las
rutas, gestionando las operaciones CRUD.
o Modelos: Crear el modelo de Usuario con Sequelize, que deberá
incluir los campos name, email, y password.
o Middlewares: Crear middleware para la protección de rutas
mediante JWT.
o Manejo de Errores: Implementar un middleware para manejar
errores globales y proporcionar respuestas claras.

3. Autenticación y Seguridad
o Implementar un sistema de autenticación basado en JWT para
permitir el acceso a rutas privadas solo a usuarios autenticados.
o Hashing de Contraseñas: Utilizar la librería bcrypt para
almacenar contraseñas de manera segura.

4. Operaciones CRUD
o Registro: La ruta de registro debe permitir que un nuevo usuario
se registre con su nombre, correo electrónico y contraseña.
o Login: La ruta de login debe autenticar al usuario y generar un
JWT si las credenciales son correctas.
o Ver Usuario: Crear una ruta que permita al usuario ver sus datos
después de autenticarse.
o Actualizar Usuario: Permitir que un usuario autenticado actualice
su propia información.
o Eliminar Usuario: Permitir que un usuario autenticado elimine su
cuenta.
5. Base de Datos
o Crear una base de datos MySQL con una tabla de usuarios.
o Utilizar Sequelize o MySql2 para definir los modelos y realizar
operaciones CRUD.

