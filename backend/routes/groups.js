/**
 * groups.js
 * Routes related to friend groups and group invitations.
 * Features:
 * - create groups
 * - list groups I own and groups I am a member of
 * - invite users to a group by email (with a preference label)
 * - view invites and accept/decline them
 */

const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const { Group, GroupMember, GroupInvite, User } = require('../models');

// Protect all group routes (user must be logged in)
router.use(authenticateToken);

/**
 * POST /api/groups
 * Create a group owned by the current user.
 * Body: { name }
 */
router.post('/', async (req, res) => {
  try {
    const owner_user_id = req.user.userId;
    const { name } = req.body;

    // Validate input
    if (!name) return res.status(400).json({ error: 'Group name is required' });

    // Create group in the database
    const group = await Group.create({ owner_user_id, name });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/groups
 * Returns:
 * - groups owned by current user
 * - groups where current user is a member
 */
router.get('/', async (req, res) => {
  try {
    const user_id = req.user.userId;

    // Groups I own
    const owned = await Group.findAll({ where: { owner_user_id: user_id } });

    // Memberships for groups I am in
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

/**
 * POST /api/groups/:id/invite
 * Invite an existing user to a group (only owner can invite).
 * Body: { email, preference_label }
 */
router.post('/:id/invite', async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const groupId = Number(req.params.id);
    const { email, preference_label } = req.body;

    // Validate input
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    // Ensure group exists AND is owned by current user
    const group = await Group.findOne({ where: { id: groupId, owner_user_id: ownerId } });
    if (!group) return res.status(404).json({ error: 'Group not found or not owned by you.' });

    // User must exist (must be registered first)
    const invitedUser = await User.findOne({ where: { email } });
    if (!invitedUser) {
      return res.status(404).json({ error: 'User with that email does not exist (must register first).' });
    }

    // Check if already a member
    const alreadyMember = await GroupMember.findOne({
      where: { group_id: groupId, user_id: invitedUser.id }
    });
    if (alreadyMember) return res.status(409).json({ error: 'User is already a member.' });

    // Check if invite is already pending
    const existingInvite = await GroupInvite.findOne({
      where: { group_id: groupId, invited_user_id: invitedUser.id, status: 'pending' }
    });
    if (existingInvite) return res.status(409).json({ error: 'Invite already pending.' });

    // Create invite
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

/**
 * GET /api/groups/invites
 * Returns all pending invites for the current user.
 * Includes group info so the frontend can show group name.
 */
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

/**
 * POST /api/groups/invites/:inviteId/accept
 * Accept an invite:
 * - creates membership
 * - marks invite status as accepted
 */
router.post('/invites/:inviteId/accept', async (req, res) => {
  try {
    const userId = req.user.userId;
    const inviteId = Number(req.params.inviteId);

    // Find invite belonging to current user
    const invite = await GroupInvite.findOne({ where: { id: inviteId, invited_user_id: userId } });
    if (!invite) return res.status(404).json({ error: 'Invite not found.' });
    if (invite.status !== 'pending') return res.status(400).json({ error: 'Invite already handled.' });

    // Create membership if not already member
    const exists = await GroupMember.findOne({ where: { group_id: invite.group_id, user_id: userId } });
    if (!exists) {
      await GroupMember.create({
        group_id: invite.group_id,
        user_id: userId,
        preference_label: invite.preference_label || null
      });
    }

    // Update invite status
    invite.status = 'accepted';
    await invite.save();

    res.json({ message: 'Invite accepted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/groups/invites/:inviteId/decline
 * Decline an invite:
 * - marks invite status as declined
 */
router.post('/invites/:inviteId/decline', async (req, res) => {
  try {
    const userId = req.user.userId;
    const inviteId = Number(req.params.inviteId);

    // Find invite belonging to current user
    const invite = await GroupInvite.findOne({ where: { id: inviteId, invited_user_id: userId } });
    if (!invite) return res.status(404).json({ error: 'Invite not found.' });
    if (invite.status !== 'pending') return res.status(400).json({ error: 'Invite already handled.' });

    // Update invite status
    invite.status = 'declined';
    await invite.save();

    res.json({ message: 'Invite declined.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
