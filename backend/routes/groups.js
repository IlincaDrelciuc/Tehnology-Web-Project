const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const { Group, GroupMember, GroupInvite, User } = require('../models');

router.use(authenticateToken);

router.post('/', async (req, res) => {
  try {
    const owner_user_id = req.user.userId;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Group name is required' });

    const group = await Group.create({ owner_user_id, name });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const user_id = req.user.userId;

    const owned = await Group.findAll({ where: { owner_user_id: user_id } });

    const memberships = await GroupMember.findAll({ where: { user_id } });
    const memberGroupIds = memberships.map((m) => m.group_id);

    const memberOf = memberGroupIds.length
      ? await Group.findAll({ where: { id: memberGroupIds } })
      : [];

    res.json({ owned, memberOf });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/invite', async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const groupId = Number(req.params.id);
    const { email, preference_label } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const group = await Group.findOne({ where: { id: groupId, owner_user_id: ownerId } });
    if (!group) return res.status(404).json({ error: 'Group not found or not owned by you.' });

    const invitedUser = await User.findOne({ where: { email } });
    if (!invitedUser) {
      return res.status(404).json({ error: 'User with that email does not exist (must register first).' });
    }

    const alreadyMember = await GroupMember.findOne({ where: { group_id: groupId, user_id: invitedUser.id } });
    if (alreadyMember) return res.status(409).json({ error: 'User is already a member.' });

    const existingInvite = await GroupInvite.findOne({
      where: { group_id: groupId, invited_user_id: invitedUser.id, status: 'pending' }
    });
    if (existingInvite) return res.status(409).json({ error: 'Invite already pending.' });

    const invite = await GroupInvite.create({
      group_id: groupId,
      inviter_user_id: ownerId,
      invited_user_id: invitedUser.id,
      preference_label: preference_label || null,
      status: 'pending'
    });

    res.status(201).json({ message: 'Invite sent.', inviteId: invite.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/invites', async (req, res) => {
  try {
    const userId = req.user.userId;

    const invites = await GroupInvite.findAll({
      where: { invited_user_id: userId, status: 'pending' },
      include: [{ model: Group, attributes: ['id', 'name'] }],
      order: [['id', 'DESC']]
    });

    res.json(invites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/invites/:inviteId/accept', async (req, res) => {
  try {
    const userId = req.user.userId;
    const inviteId = Number(req.params.inviteId);

    const invite = await GroupInvite.findOne({ where: { id: inviteId, invited_user_id: userId } });
    if (!invite) return res.status(404).json({ error: 'Invite not found.' });
    if (invite.status !== 'pending') return res.status(400).json({ error: 'Invite already handled.' });

    const exists = await GroupMember.findOne({ where: { group_id: invite.group_id, user_id: userId } });
    if (!exists) {
      await GroupMember.create({
        group_id: invite.group_id,
        user_id: userId,
        preference_label: invite.preference_label || null
      });
    }

    invite.status = 'accepted';
    await invite.save();

    res.json({ message: 'Invite accepted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/invites/:inviteId/decline', async (req, res) => {
  try {
    const userId = req.user.userId;
    const inviteId = Number(req.params.inviteId);

    const invite = await GroupInvite.findOne({ where: { id: inviteId, invited_user_id: userId } });
    if (!invite) return res.status(404).json({ error: 'Invite not found.' });
    if (invite.status !== 'pending') return res.status(400).json({ error: 'Invite already handled.' });

    invite.status = 'declined';
    await invite.save();

    res.json({ message: 'Invite declined.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
