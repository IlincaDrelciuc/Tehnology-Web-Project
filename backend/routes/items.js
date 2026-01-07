const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const { Item } = require('../models');
const { Op } = require('sequelize');

router.use(authenticateToken);

router.get('/shareable', async (req, res) => {
  try {
    const items = await Item.findAll({
      where: {
        is_shareable: true,
        claimed_by: null
      },
      order: [['expiry_date', 'ASC']]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const user_id = req.user.userId;
  const { name, category, quantity, expiry_date, is_shareable } = req.body;

  if (!name || !expiry_date) {
    return res.status(400).json({ error: 'Name and Expiry Date are required.' });
  }

  try {
    const item = await Item.create({
      user_id,
      name,
      category: category || null,
      quantity: quantity || null,
      expiry_date,
      is_shareable: !!is_shareable
    });

    res.status(201).json({
      message: 'Item added to fridge',
      itemId: item.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const user_id = req.user.userId;

  try {
    const items = await Item.findAll({
      where: { user_id },
      order: [['expiry_date', 'ASC']]
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const user_id = req.user.userId;
  const item_id = req.params.id;
  const { name, category, quantity, expiry_date, is_shareable } = req.body;

  if (!name || !expiry_date) {
    return res.status(400).json({ error: 'Name and Expiry Date are required.' });
  }

  try {
    const [updatedCount] = await Item.update(
      {
        name,
        category: category || null,
        quantity: quantity || null,
        expiry_date,
        is_shareable: !!is_shareable
      },
      {
        where: { id: item_id, user_id }
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Item not found or unauthorized.' });
    }

    res.json({ message: 'Item updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const user_id = req.user.userId;
  const item_id = req.params.id;

  try {
    const deletedCount = await Item.destroy({
      where: { id: item_id, user_id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found or unauthorized.' });
    }

    res.json({ message: 'Item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/claim', async (req, res) => {
  const user_id = req.user.userId;
  const item_id = req.params.id;

  try {
    const item = await Item.findByPk(item_id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    if (!item.is_shareable) {
      return res.status(400).json({ error: 'Item is not shareable.' });
    }

    if (item.claimed_by) {
      return res.status(409).json({ error: 'Item already claimed.' });
    }

    if (item.user_id === user_id) {
      return res.status(400).json({ error: 'You cannot claim your own item.' });
    }

    item.claimed_by = user_id;
    item.claimed_at = new Date();
    await item.save();

    res.json({ message: 'Item claimed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
