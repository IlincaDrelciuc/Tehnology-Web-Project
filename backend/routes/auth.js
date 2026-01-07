const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');


const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, userId: user.id });
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

module.exports = router;
