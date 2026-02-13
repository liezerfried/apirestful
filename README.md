# Project Documentation

## Project Description

RESTful API to manage student and teacher data using Node.js, Express, and ESM (ECMAScript Modules).

The project architecture is based on the MVC (Model-View-Controller) pattern, separating business logic, routes, and data modeling to facilitate maintenance and scalability.

## Environment Setup

1. Make sure Node.js is installed: `node -v`
2. Create the `package.json` file: `npm init -y`
3. Install Express.js: `npm install express`
4. Install cors: `npm install cors`
5. Configure package.json to use ESM:
   - Change `"type": "commonjs"` to `"type": "module"`

## Main Code (index.js)

```javascript
// Import the express module
import express from 'express';

// Create an instance of the Express application
const app = express();

// Middleware to process JSON data in requests
app.use(express.json());

// Example route: responds to GET requests at the root "/"
app.get('/', (req, res) => {
  // Sends a confirmation message
  res.send('API RESTful running');
});

// Define the port where the server will run (default 3000)
const PORT = process.env.PORT || 3000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Export the app instance (useful for testing or modularization)
export default app;
```

## Notes
- The project is configured to use ESM modules (`"type": "module"` in package.json).
- The server listens on port 3000 by default.
- `express.json()` allows receiving and processing JSON data in requests.
- It is recommended to define routes and middlewares before `app.listen`.

## Next Steps
- Add routes for students and teachers.
- Integrate TypeORM and MySQL for data persistence.
- Implement tests with Postman.
- Document agent workflows for development organization.

## Agent Workflows

- architect.md: Defines structure, technologies, and patterns.
- backend.md: Implements API, routes, logic, and database connection.
- database.md: Models entities, migrations, and relationships.
- tester.md: Tests endpoints and functionalities.
- reviewer.md: Reviews code quality and best practices.
- frontend.md, i18n.md: Optional for future integrations.

## Example of a question to an agent

@backend How do I validate input data in the students endpoint?
@database How do I create a migration to add a field to the teachers table?

---

This document will be updated as development progresses.