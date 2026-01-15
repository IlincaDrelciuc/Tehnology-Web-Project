const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const groupRoutes = require('./routes/groups');
const externalRoutes = require('./routes/external');

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
      console.log(`Open http://localhost:${PORT} in your browser to check the status.`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
