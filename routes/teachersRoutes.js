// Importa express para definir rutas
import express from 'express';

// Crea un router para las rutas de profesores
// express.Router() permite crear un conjunto de rutas agrupadas y modulares
const router = express.Router();

// Ruta GET para obtener todos los profesores
router.get('/', (req, res) => {
  res.json({ message: 'Lista de profesores' });
});

// Ruta POST para crear un nuevo profesor
router.post('/', (req, res) => {
  res.json({ message: 'Profesor creado', data: req.body });
});

// Ruta PUT para actualizar un profesor existente
router.put('/:id', (req, res) => {
  res.json({ message: `Profesor con id ${req.params.id} actualizado`, data: req.body });
});

// Ruta DELETE para eliminar un profesor
router.delete('/:id', (req, res) => {
  res.json({ message: `Profesor con id ${req.params.id} eliminado` });
});

// Exporta el router para usarlo en otros archivos (por ejemplo, en index.js)
export default router;
