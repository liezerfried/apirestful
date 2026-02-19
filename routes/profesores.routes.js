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
  res.json({ message: 'Profesor creado', data: req.body });  // en el body se espera un JSON con los datos del nuevo profesor
});

// Rutas para operaciones con un profesor específico (GET, PUT, DELETE) usando router.route() para agruparlas
router.route('/:id')
      .get((req, res) => {
        res.json({ message: `Profesor con id ${req.params.id}` });
      })
      .put((req, res) => {
        res.json({ message: `Profesor con id ${req.params.id} actualizado`, data: req.body });
      })
      .delete((req, res) => {
        res.json({ message: `Profesor con id ${req.params.id} eliminado` });
      });

// Exporta el router para usarlo en otros archivos (por ejemplo, en index.js)
export default router;
