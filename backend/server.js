/**
 * server.js
 * Entry point of the Anti Food Waste App backend.
 * This file configures the Express server, registers routes,
 * connects to the database using Sequelize, and starts the server.
 */

const express = require('express');
const app = express();
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();

// Import Sequelize instance (database connection)
const { sequelize } = require('./models');

// Import route modules
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const groupRoutes = require('./routes/groups');

// Middleware to parse JSON bodies from HTTP requests
app.use(express.json());


app.use(cors({
  origin: '*'
}));

// Register API routes
app.use('/api/auth', authRoutes);     // Authentication routes (login, register)
app.use('/api/items', itemRoutes);   // Item management routes
app.use('/api/groups', groupRoutes); // Groups and invitations routes

/**
 * Root endpoint used for testing if the server is running
 */
app.get('/', (req, res) => {
  res.send('Anti Food Waste App API is running!');
});

// Server port (default 3000 if not defined in .env)
const PORT = process.env.PORT || 3000;

/**
 * Synchronize database models and start the server
 */
sequelize
  .sync()
  .then(() => {
    console.log('Database synced (Sequelize).');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Open http://localhost:${PORT} in your browser to check the status.`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
