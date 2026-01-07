const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { Item } = require('../models');

router.use(authenticateToken);


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

    res.status(201).json({ message: 'Item added to fridge', itemId: item.id });
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
      { where: { id: item_id, user_id } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: 'Item not found or unauthorized access.' });
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
    const deletedCount = await Item.destroy({ where: { id: item_id, user_id } });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found or unauthorized access.' });
    }

    res.json({ message: 'Item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
