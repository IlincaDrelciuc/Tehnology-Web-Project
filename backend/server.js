// backend/server.js
// Main entry point for the backend REST API.
// Responsibilities:
// 1) Create Express app
// 2) Enable middleware (JSON + CORS)
// 3) Register routes (/api/auth, /api/items, /api/groups, /api/external)
// 4) Connect/sync database using Sequelize
// 5) Start the server (listen on PORT)

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import Sequelize instance (configured for SQLite locally / Postgres on Render)
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const groupRoutes = require('./routes/groups');
const externalRoutes = require('./routes/external');

// --------------------
// Middleware
// --------------------

// This allows Express to read JSON bodies (req.body)
app.use(express.json());

// Allow frontend to call backend (important in deployment!)
//
// FRONTEND_URL example: https://your-frontend.onrender.com
// If FRONTEND_URL is missing, we allow all origins (OK for demo, but less secure).
const allowedOrigin = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: allowedOrigin || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// --------------------
// Routes
// --------------------

// Simple health check endpoint (nice for debugging)
app.get('/', (req, res) => {
  res.send('Anti Food Waste App API is running!');
});

// REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/groups', groupRoutes);

// External API route (OpenFoodFacts)
app.use('/api/external', externalRoutes);

// --------------------
// Start server
// --------------------

const PORT = process.env.PORT || 3000;

// Sequelize sync creates tables based on your models if they don’t exist.
sequelize
  .sync()
  .then(() => {
    console.log('Database synced (Sequelize).');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
