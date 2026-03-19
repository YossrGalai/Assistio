const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/reviews/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ toUser: req.params.userId })
      .populate('fromUser', 'name profileImageUrl')
      .populate('request', 'title')
      .sort({ createdAt: -1 });

    const normalized = reviews.map(r => ({
      id: r._id.toString(),
      requestId: r.request?._id?.toString(),
      requestTitle: r.request?.title,
      fromUserId: r.fromUser?._id?.toString(),
      toUserId: r.toUser?.toString(),
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      fromUser: {
        name: r.fromUser?.name || 'Utilisateur',
        avatar: r.fromUser?.name
          ? r.fromUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
          : '??',
      },
    }));

    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/reviews  (auth required)
// POST /api/reviews  (auth temporairement désactivé)
router.post('/', async (req, res) => {
  try {
    const { requestId, toUserId, rating, comment, fromUserId } = req.body;

    if (!requestId || !toUserId || !rating || !comment) {
      return res.status(400).json({ message: 'requestId, toUserId, rating et comment sont requis' });
    }

    // Utiliser fromUserId du body au lieu de req.user.userId
    const reviewerId = fromUserId || 'anonymous';

    if (toUserId === reviewerId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous évaluer vous-même' });
    }

    const existing = await Review.findOne({
      request: requestId,
      fromUser: reviewerId,
      toUser: toUserId,
    });
    if (existing) {
      return res.status(400).json({ message: 'Vous avez déjà évalué cette demande' });
    }

    const review = new Review({
      request: requestId,
      fromUser: reviewerId,
      toUser: toUserId,
      rating: Number(rating),
      comment,
    });

    await review.save();

    // Mettre à jour les ratings du user ciblé
    await User.findByIdAndUpdate(toUserId, {
      $push: { ratings: Number(rating) },
    });

    await review.populate('fromUser', 'name profileImageUrl');

    res.status(201).json({
      id: review._id.toString(),
      requestId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      fromUser: {
        name: review.fromUser?.name || 'Utilisateur',
        avatar: review.fromUser?.name
          ? review.fromUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
          : '??',
      },
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Vous avez déjà évalué cette demande' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;