// Importa express para definir rutas
import express from 'express';

// Crea un router para las rutas de profesores
// express.Router() permite crear un conjunto de rutas agrupadas y modulares
const router = express.Router();

// Ruta GET para obtener todos los profesores: Obtiene la lista de todos los profesores. 
// No necesita un id porque devuelve todos.
router.get('/', (req, res) => {
  res.json({ message: 'Lista de profesores' });
});

// Ruta POST para crear un nuevo profesor: Crea un nuevo profesor. 
// No necesita un id porque el profesor aún no existe; el servidor lo genera.
router.post('/', (req, res) => {
  res.json({ message: 'Profesor creado', data: req.body });
});

// Ruta PUT para actualizar un profesor existente: Actualiza un profesor existente. 
// Necesita el id para saber cuál profesor modificar.
router.put('/:id', (req, res) => {
  res.json({ message: `Profesor con id ${req.params.id} actualizado`, data: req.body });
});

// Ruta DELETE para eliminar un profesor: Elimina un profesor. 
// Necesita el id para saber cuál profesor borrar.
router.delete('/:id', (req, res) => {
  res.json({ message: `Profesor con id ${req.params.id} eliminado` });
});

// Exporta el router para usarlo en otros archivos (por ejemplo, en index.js)
export default router;
