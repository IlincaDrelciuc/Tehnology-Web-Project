/**
 * auth.js
 * This file defines authentication-related routes.
 * It allows users to register and log in using email and password.
 * Passwords are securely hashed and authentication is handled with JWT.
 */

const express = require('express');
const router = express.Router();

// Library used to hash passwords
const bcrypt = require('bcrypt');

// Library used to create and verify JWT tokens
const jwt = require('jsonwebtoken');

// Import User model from Sequelize
const { User } = require('../models');

// Secret key for JWT signing (loaded from .env file)
const JWT_SECRET = process.env.JWT_SECRET;

// Number of salt rounds used by bcrypt for hashing passwords
const saltRounds = 10;

/**
 * POST /api/auth/register
 * Registers a new user with email and password.
 */
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Check if a user with the same email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user in the database
    const user = await User.create({
      email,
      password: hashedPassword
    });

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      userId: user.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token.
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare provided password with stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create JWT token containing user information
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token back to the client
    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Export router to be used in server.js
module.exports = router;
