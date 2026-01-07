const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken); 

router.post('/', (req, res) => {
    const user_id = req.user.userId; 
    const { name, category, quantity, expiry_date, is_shareable } = req.body;
    
    if (!name || !expiry_date) {
        return res.status(400).json({ error: 'Name and Expiry Date are required.' });
    }

    const shareableFlag = is_shareable ? 1 : 0; 
    const sql = `
        INSERT INTO items (user_id, name, category, quantity, expiry_date, is_shareable) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [user_id, name, category, quantity, expiry_date, shareableFlag];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: 'Item added to fridge', 
            itemId: this.lastID 
        });
    });
});

router.get('/', (req, res) => {
    const user_id = req.user.userId;
    const sql = 'SELECT * FROM items WHERE user_id = ? ORDER BY expiry_date ASC';

    db.all(sql, [user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows); 
    });
});

router.put('/:id', (req, res) => {
    const user_id = req.user.userId;
    const item_id = req.params.id; 
    const { name, category, quantity, expiry_date, is_shareable } = req.body;

    const shareableFlag = is_shareable ? 1 : 0;
    const sql = `
        UPDATE items SET 
            name = ?, category = ?, quantity = ?, expiry_date = ?, is_shareable = ?
        WHERE id = ? AND user_id = ? 
    `;
    const params = [name, category, quantity, expiry_date, shareableFlag, item_id, user_id];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Item not found or unauthorized access.' });
        }
        res.json({ message: 'Item updated successfully.' });
    });
});

router.delete('/:id', (req, res) => {
    const user_id = req.user.userId;
    const item_id = req.params.id;

    const sql = 'DELETE FROM items WHERE id = ? AND user_id = ?';

    db.run(sql, [item_id, user_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Item not found or unauthorized access.' });
        }
        res.json({ message: 'Item deleted successfully.' });
    });
});

module.exports = router;