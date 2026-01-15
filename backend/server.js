const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const groupRoutes = require('./routes/groups');
const externalRoutes = require('./routes/external');

const app = express();

/**
 * Enable CORS so the deployed React frontend can call this API.
 * In production we allow the exact frontend domain (RENDER_FRONTEND_URL).
 */
const allowedOrigin = process.env.RENDER_FRONTEND_URL || '*';
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/external', externalRoutes);

app.get('/', (req, res) => {
  res.send('Anti Food Waste App API is running!');
});

const PORT = process.env.PORT || 3000;

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
