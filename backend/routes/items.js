const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const { Item, Group, GroupMember } = require('../models');
const { Op } = require('sequelize');

router.use(authenticateToken);

/**
 * Get items available to claim for current user:
 * - shareable
 * - not claimed
 * - not owned by current user
 * - public OR shared to a group user is a member of
 * GET /api/items/shareable
 */
router.get('/shareable', async (req, res) => {
  try {
    const user_id = req.user.userId;

    const memberships = await GroupMember.findAll({ where: { user_id } });
    const groupIds = memberships.map((m) => m.group_id);

    const items = await Item.findAll({
      where: {
        is_shareable: true,
        claimed_by: null,
        user_id: { [Op.ne]: user_id },
        [Op.or]: [
          { shared_group_id: null },
          ...(groupIds.length ? [{ shared_group_id: { [Op.in]: groupIds } }] : [])
        ]
      },
      order: [['expiry_date', 'ASC']]
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Create item in my fridge
 * POST /api/items
 */
router.post('/', async (req, res) => {
  const user_id = req.user.userId;
  const { name, category, quantity, expiry_date, is_shareable, shared_group_id } = req.body;

  if (!name || !expiry_date) {
    return res.status(400).json({ error: 'Name and Expiry Date are required.' });
  }

  try {
    let groupIdToSave = null;

    if (is_shareable && shared_group_id) {
      const group = await Group.findByPk(Number(shared_group_id));
      if (!group) return res.status(400).json({ error: 'Group does not exist' });
      if (group.owner_user_id !== user_id) {
        return res.status(403).json({ error: 'You can only share to your own groups' });
      }
      groupIdToSave = group.id;
    }

    const item = await Item.create({
      user_id,
      name,
      category: category || null,
      quantity: quantity || null,
      expiry_date,
      is_shareable: !!is_shareable,
      shared_group_id: groupIdToSave
    });

    res.status(201).json({ message: 'Item added to fridge', itemId: item.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get my items
 * GET /api/items
 */
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

/**
 * Update my item
 * PUT /api/items/:id
 */
router.put('/:id', async (req, res) => {
  const user_id = req.user.userId;
  const item_id = req.params.id;
  const { name, category, quantity, expiry_date, is_shareable, shared_group_id } = req.body;

  if (!name || !expiry_date) return res.status(400).json({ error: 'Name and Expiry Date are required.' });

  try {
    const item = await Item.findOne({ where: { id: item_id, user_id } });
    if (!item) return res.status(404).json({ error: 'Item not found or unauthorized.' });

    let groupIdToSave = null;

    if (is_shareable && shared_group_id) {
      const group = await Group.findByPk(Number(shared_group_id));
      if (!group) return res.status(400).json({ error: 'Group does not exist' });
      if (group.owner_user_id !== user_id) {
        return res.status(403).json({ error: 'You can only share to your own groups' });
      }
      groupIdToSave = group.id;
    }

    item.name = name;
    item.category = category || null;
    item.quantity = quantity || null;
    item.expiry_date = expiry_date;
    item.is_shareable = !!is_shareable;
    item.shared_group_id = groupIdToSave;

    await item.save();

    res.json({ message: 'Item updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Delete my item
 * DELETE /api/items/:id
 */
router.delete('/:id', async (req, res) => {
  const user_id = req.user.userId;
  const item_id = req.params.id;

  try {
    const deletedCount = await Item.destroy({ where: { id: item_id, user_id } });
    if (deletedCount === 0) return res.status(404).json({ error: 'Item not found or unauthorized.' });
    res.json({ message: 'Item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Claim a shareable item:
 * - item becomes owned by claimant (moves into their fridge)
 * - item becomes not shareable anymore
 * POST /api/items/:id/claim
 */
router.post('/:id/claim', async (req, res) => {
  const user_id = req.user.userId;
  const item_id = req.params.id;

  try {
    const item = await Item.findByPk(item_id);

    if (!item) return res.status(404).json({ error: 'Item not found.' });
    if (!item.is_shareable) return res.status(400).json({ error: 'Item is not shareable.' });
    if (item.claimed_by) return res.status(409).json({ error: 'Item already claimed.' });
    if (item.user_id === user_id) return res.status(400).json({ error: 'You cannot claim your own item.' });

    if (item.shared_group_id) {
      const membership = await GroupMember.findOne({
        where: { group_id: item.shared_group_id, user_id }
      });
      if (!membership) {
        return res.status(403).json({ error: 'This item is shared to a group you are not in.' });
      }
    }

    item.user_id = user_id;
    item.is_shareable = false;
    item.shared_group_id = null;
    item.claimed_by = user_id;
    item.claimed_at = new Date();

    await item.save();

    res.json({ message: 'Item claimed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
