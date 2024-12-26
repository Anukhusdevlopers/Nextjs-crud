const express = require('express');
const cors = require('cors');
const routes = require('../nextjs-crud-app/src/app/api/posts/routes'); // Import routes
const connectDB = require('../nextjs-crud-app/src/app/api/posts/db'); // Import database connection file
const app = express();
require('dotenv').config();

// Connect to the database
connectDB();

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the imported routes
app.use(routes);

// Start the server
const port = 4000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
