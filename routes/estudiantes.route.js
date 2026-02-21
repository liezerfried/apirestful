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
  res.json({ message: 'Estudiante creado', data: req.body }); // en el body se espera un JSON con los datos del nuevo estudiante
});

// Rutas para operaciones con un estudiante específico (GET, PUT, DELETE) usando router.route() para agruparlas
router.route('/:id')
      .get((req, res) => {
        res.json({ message: `Estudiante con id ${req.params.id}` });
      })
      .put((req, res) => {
        res.json({ message: `Estudiante con id ${req.params.id} actualizado`, data: req.body });
      })
      .delete((req, res) => {
        res.json({ message: `Estudiante con id ${req.params.id} eliminado` });
      });

// Exporta el router para usarlo en otros archivos (por ejemplo, en app.js)
export default router;
