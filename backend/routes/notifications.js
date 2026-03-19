const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/notifications  (auth required)
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { userId: req.user.userId },
        { user: req.user.userId }
      ]
    })
      .populate('fromUser', 'name profileImageUrl')
      .populate('relatedRequest', 'title')
      .sort({ date: -1, createdAt: -1 })
      .limit(50);

    const normalized = notifications.map(n => ({
      id: n._id.toString(),
      type: n.type || 'systeme',
      title: n.title || labelFromMessage(n.message),
      message: n.message,
      read: n.status === 'read' || n.read,
      createdAt: (n.date || n.createdAt || new Date()).toISOString(),
      relatedRequestId: n.relatedRequest?._id?.toString(),
      fromUser: n.fromUser
        ? {
            name: n.fromUser.name,
            avatar: n.fromUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
          }
        : undefined,
    }));

    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ userId: req.user.userId }, { user: req.user.userId }]
      },
      { $set: { read: true, status: 'read' } },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json({ id: notif._id.toString(), read: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { $or: [{ userId: req.user.userId }, { user: req.user.userId }] },
      { $set: { read: true, status: 'read' } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

function labelFromMessage(msg) {
  if (!msg) return 'Notification';
  if (msg.includes('acceptée')) return 'Aide acceptée';
  if (msg.includes('évaluation')) return 'Avis reçu';
  if (msg.includes('confirmée')) return 'Aide confirmée';
  if (msg.includes('commenté')) return 'Nouveau commentaire';
  return 'Notification';
}

module.exports = router;