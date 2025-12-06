const express = require('express');
const app = express();
require('dotenv').config(); 
const db = require('./database'); 

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
    res.send('Anti Food Waste App API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to check the status.`);
});