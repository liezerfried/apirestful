# DOCUMENT.md

## Descripción del proyecto

API RESTful para gestionar datos de estudiantes y profesores usando Node.js, Express y ESM (ECMAScript Modules).

La arquitectura del proyecto se va a basar en el patrón MVC (Modelo-Vista-Controlador), separando la lógica de negocio, las rutas y el modelado de datos para facilitar el mantenimiento y la escalabilidad.

## Preparación del ambiente

1. Verificar que Node.js esté instalado: `node -v`
2. Crear el archivo `package.json`: `npm init -y`
3. Instalar Express.js: `npm install express`
4. Instalar cors: `npm install cors`
5. Configurar package.json para usar ESM:
   - Cambiar "type": "commonjs" por "type": "module"

## Código principal (index.js)

```javascript
// Importa el módulo express
import express from 'express';

// Crea una instancia de la aplicación Express
const app = express();

// Middleware para procesar datos JSON en las peticiones
app.use(express.json());

// Ruta de ejemplo: responde a solicitudes GET en la raíz "/"
app.get('/', (req, res) => {
  // Envía un mensaje de confirmación
  res.send('API RESTful funcionando');
});

// Define el puerto en el que se ejecutará el servidor (por defecto 3000)
const PORT = process.env.PORT || 3000;

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

// Exporta la instancia de la aplicación (útil para pruebas o modularización)
export default app;
```

## Notas
- El proyecto está configurado para usar módulos ESM ("type": "module" en package.json).
- El servidor escucha en el puerto 3000 por defecto.
- express.json() permite recibir y procesar datos JSON en las peticiones.
- Se recomienda definir rutas y middlewares antes de app.listen.

## Próximos pasos
- Agregar rutas para estudiantes y profesores.
- Integrar TypeORM y MySQL para persistencia de datos.
- Implementar pruebas con Postman.
- Documentar workflows de agentes para organización del desarrollo.

## Workflows de agentes

- architect.md: Define estructura, tecnologías y patrones.
- backend.md: Implementa API, rutas, lógica y conexión a base de datos.
- database.md: Modela entidades, migraciones y relaciones.
- tester.md: Prueba endpoints y funcionalidades.
- reviewer.md: Revisa calidad y buenas prácticas.
- frontend.md, i18n.md: Opcionales para futuras integraciones.

## Ejemplo de pregunta a un agente

@backend ¿Cómo valido los datos de entrada en el endpoint de estudiantes?
@database ¿Cómo hago una migración para agregar un campo a la tabla profesores?

---

Este documento se irá actualizando conforme avance el desarrollo.
