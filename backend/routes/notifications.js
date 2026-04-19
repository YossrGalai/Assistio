const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/notifications
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id.toString();

    const notifications = await Notification.find({ userId })
      .populate('fromUser', 'name profileImageUrl')
      .populate('relatedRequest', 'title')
      .sort({ date: -1, createdAt: -1 })
      .limit(50);

    const normalized = notifications.map((n) => ({
      id: n._id.toString(),
      type: n.type || inferTypeFromMessage(n.message),
      title: n.title || inferTitleFromMessage(n.message),
      message: n.message,
      read: n.status === 'read' || n.read === true,
      createdAt: (n.date || n.createdAt || new Date()).toISOString(),
      relatedRequestId: n.relatedRequest?._id?.toString() || n.relatedRequest?.toString(),
      fromUser: n.fromUser
        ? {
            name: n.fromUser.name,
            avatar: n.fromUser.name
              .split(' ')
              .map(w => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2),
          }
        : undefined,
    }));

    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', auth, async (req, res) => {
  try {
    const userId = req.user.id.toString();
    await Notification.updateMany(
      { userId },
      { $set: { read: true, status: 'read' } }
    );
    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id.toString() },
      { $set: { read: true, status: 'read' } },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Notification introuvable' });
    res.json({ id: notif._id.toString(), read: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id.toString(),
    });
    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/notifications
router.post('/', auth, async (req, res) => {
  try {
    const { targetUserId, type, title, message, relatedRequestId, fromUserId } = req.body;

    const notif = new Notification({
      userId: targetUserId.toString(),
      type: type || 'systeme',
      title: title || '',
      message,
      relatedRequest: relatedRequestId || undefined,
      fromUser: fromUserId || undefined,
    });

    await notif.save();

    const normalized = {
      id: notif._id.toString(),
      type: notif.type,
      title: notif.title || inferTitleFromMessage(notif.message),
      message: notif.message,
      read: false,
      createdAt: (notif.date || notif.createdAt || new Date()).toISOString(),
    };

    const io = req.app.get('io');
    if (io) {
      io.to(targetUserId.toString()).emit('new_notification', normalized);
    }

    res.status(201).json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function inferTitleFromMessage(msg) {
  if (!msg) return 'Notification';
  if (msg.includes('acceptée')) return 'Aide acceptée';
  if (msg.includes('évaluation')) return 'Avis reçu';
  if (msg.includes('confirmée')) return 'Aide confirmée';
  if (msg.includes('commenté')) return 'Nouveau commentaire';
  if (msg.includes('proposée')) return 'Nouvelle aide proposée';
  if (msg.includes('terminée') || msg.includes('terminé')) return 'Demande terminée';
  return 'Notification système';
}

function inferTypeFromMessage(msg) {
  if (!msg) return 'systeme';
  if (msg.includes('proposée')) return 'aide_proposee';
  if (msg.includes('acceptée') || msg.includes('confirmée')) return 'aide_acceptee';
  if (msg.includes('terminée') || msg.includes('terminé')) return 'demande_terminee';
  if (msg.includes('commenté')) return 'nouveau_commentaire';
  if (msg.includes('évaluation')) return 'review_recue';
  return 'systeme';
}

module.exports = router;