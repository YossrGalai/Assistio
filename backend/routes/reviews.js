const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const auth = require('../middleware/auth');

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
router.post('/', auth, async (req, res) => {
  try {
    const { requestId, toUserId, rating, comment } = req.body;

    // Prevent self-review
    if (toUserId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot review yourself' });
    }

    // Prevent duplicate review for same request
    const existing = await Review.findOne({
      request: requestId,
      fromUser: req.user.userId,
      toUser: toUserId,
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this request' });
    }

    const review = new Review({
      request: requestId,
      fromUser: req.user.userId,
      toUser: toUserId,
      rating,
      comment,
    });
    await review.save();

    // Update the target user's ratings array
    await User.findByIdAndUpdate(toUserId, { $push: { ratings: rating } });

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
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;