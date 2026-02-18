// Importa express para definir rutas
import express from 'express';

// Crea un router para las rutas de estudiantes
// express.Router() permite crear un conjunto de rutas agrupadas y modulares
const router = express.Router();

// Ruta GET para obtener todos los estudiantes: Obtiene la lista de todos los estudiantes. 
// No necesita un id porque devuelve todos.
router.get('/', (req, res) => {
  res.json({ message: 'Lista de estudiantes' });
});

// Ruta POST para crear un nuevo estudiante: Crea un nuevo estudiante. 
// No necesita un id porque el estudiante aún no existe; el servidor lo genera.
router.post('/', (req, res) => {
  res.json({ message: 'Estudiante creado', data: req.body });
});

// Ruta PUT para actualizar un estudiante existente: Actualiza un estudiante existente. 
// Necesita el id para saber cuál estudiante modificar.
router.put('/:id', (req, res) => {
  res.json({ message: `Estudiante con id ${req.params.id} actualizado`, data: req.body });
});

// Ruta DELETE para eliminar un estudiante: Elimina un estudiante. 
// Necesita el id para saber cuál estudiante borrar.
router.delete('/:id', (req, res) => {
  res.json({ message: `Estudiante con id ${req.params.id} eliminado` });
});

// Exporta el router para usarlo en otros archivos (por ejemplo, en index.js)
export default router;
