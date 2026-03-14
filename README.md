# API RESTful - Gestión de Usuarios

## Descripción

Este proyecto es una API RESTful desarrollada con Node.js y Express que permite gestionar usuarios con un sistema de autenticación basado en JSON Web Tokens (JWT). La aplicación utiliza MySQL como base de datos y Sequelize como ORM para interactuar con ella.

El objetivo principal es proporcionar una estructura base para aplicaciones que requieran registro de usuarios, inicio de sesión y gestión de perfiles, siguiendo buenas prácticas de seguridad y organización de código.

## Funcionalidades

La API permite a los usuarios registrarse con su nombre, correo electrónico y contraseña. Una vez registrados, pueden iniciar sesión para obtener un token JWT que les permite acceder a rutas protegidas. Con este token, los usuarios pueden consultar su perfil, actualizar sus datos personales o eliminar su cuenta.

Las contraseñas se almacenan de forma segura utilizando bcrypt, que aplica un algoritmo de hashing con salt para evitar que sean legibles directamente en la base de datos. Además, todas las entradas de usuario pasan por un proceso de validación y sanitización antes de ser procesadas.

## Tecnologías utilizadas

El backend está construido con Express 5, un framework minimalista para Node.js que facilita la creación de servidores HTTP. Para la persistencia de datos se utiliza MySQL junto con Sequelize, un ORM que permite definir modelos y realizar consultas sin escribir SQL directamente.

La autenticación se implementa con jsonwebtoken, una librería que permite generar y verificar tokens JWT. Para la validación de datos se usa express-validator, que proporciona un conjunto de middlewares para verificar y sanear los datos recibidos en las peticiones.

El proyecto también incluye un panel de pruebas visual desarrollado con EJS, un motor de plantillas que permite renderizar HTML desde el servidor. Este panel facilita probar los endpoints sin necesidad de herramientas externas.

## Arquitectura

El código sigue una arquitectura por capas separando responsabilidades: los controladores manejan la lógica de negocio, los modelos definen la estructura de datos, las rutas agrupan los endpoints, y los middlewares procesan las peticiones antes de llegar a los controladores.

El servidor inicia de forma secuencial, primero estableciendo la conexión con la base de datos, luego inicializando los modelos de Sequelize, sincronizando las tablas y finalmente levantando el servidor HTTP para aceptar peticiones.

## Seguridad

Se implementan varias medidas de seguridad: las contraseñas nunca se almacenan en texto plano gracias a bcrypt, los tokens JWT tienen una duración limitada y se firman con una clave secreta, los datos de entrada se validan y sanitizan para prevenir inyecciones, y el campo de contraseña se excluye automáticamente de las respuestas JSON para evitar exposición accidental.
