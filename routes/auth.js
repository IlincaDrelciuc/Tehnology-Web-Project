const express = require('express');
const router = express.Router();
const db = require('../database'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10; 

router.post('/register', async (req, res) => {
    const { email, password } = req.body; 
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        
        db.run(sql, [email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'User already exists.' });
                }
                return res.status(500).json({ error: 'Registration failed: ' + err.message });
            }
            res.status(201).json({ 
                message: 'User registered successfully',
                userId: this.lastID 
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT id, email, password FROM users WHERE email = ?';

    db.get(sql, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(200).json({ 
            message: 'Login successful', 
            token: token,
            userId: user.id 
        });
    });
});

module.exports = router;