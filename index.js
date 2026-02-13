/**
 * Recommended order for configuring an Express app:
 *
 * 1. Global middlewares (e.g., app.use(express.json()), cors, etc.)
 * 2. Routers or specific middlewares (e.g., app.use('/teachers', teachersRoutes))
 * 3. Specific routes (e.g., app.get('/'), app.post('/login'), etc.)
 * 4. app.listen() to start the server
 *
 * This order ensures:
 * - All requests go through middlewares and routers first.
 * - Specific routes are available after applying middlewares.
 * - The server starts listening only when everything is properly configured.
 */

// Import the express module (framework for building web servers)
import express from 'express';
// Import the teachers router
import teachersRoutes from './routes/teachersRoutes.js';

// Create an instance of the Express application (main API app)
const app = express();

// Middleware to process JSON data in requests (converts JSON body to JS object)
app.use(express.json());

// Use the teachers router under the '/teachers' prefix
app.use('/teachers', teachersRoutes);

// Example route: responds to GET requests at the root "/"
// app.get defines a route for the HTTP GET method
app.get('/', (req, res) => {
  // res.send sends a response to the client
  res.send('API RESTful running');
});

// Define the port where the server will run (default 3000)
// process.env.PORT allows using a port defined in environment variables
const PORT = process.env.PORT || 3000;

// Start the server and listen on the defined port
// app.listen starts the server and runs the callback when ready
app.listen(PORT, () => {
  // console.log shows a message in the console when the server is active
  console.log(`Server listening on port ${PORT}`);
});

// Export the app instance (useful for testing or modularization)
export default app;