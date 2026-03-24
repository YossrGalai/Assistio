const express = require('express');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/users/profile (auth requis)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const completedHelps = await countCompletedRequests(req.user.userId);
    res.json({ ...formatUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/profile (auth requis)
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedFields = ['name', 'city', 'gouvernorat', 'phone', 'bio', 'skills', 'profileImageUrl'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const completedHelps = await countCompletedRequests(req.user.userId);
    res.json({ ...formatUser(user), completedHelps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/:id (public) - only match valid Mongo ObjectId
router.get('/:id([0-9a-fA-F]{24})', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const completedHelps = await countCompletedRequests(req.params.id);
    res.json({ ...formatUser(user), completedHelps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Helper : compter les demandes terminées ──────────────────────────────────
async function countCompletedRequests(userId) {
  const Volunteer = require('../models/Volunteer');
  
  // Compter les demandes où ce user était volunteer accepté ET terminées
  const acceptedVolunteers = await Volunteer.find({
    userId: userId.toString(),
    status: 'accepted',
  });

  const requestIds = acceptedVolunteers.map(v => v.requestId);

  const count = await ServiceRequest.countDocuments({
    _id: { $in: requestIds },
    status: { $in: ['done', 'terminée'] },
  });

  return count;
}

// ─── Helper : formater l'utilisateur ─────────────────────────────────────────
function formatUser(user) {
  const obj = user.toObject();
  const ratings = obj.ratings || [];
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : 0;
  const avatarInitials = obj.name
    ? obj.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return {
    id: obj._id.toString(),
    name: obj.name,
    email: obj.email,
    avatar: avatarInitials,
    city: obj.city || '',
    gouvernorat: obj.gouvernorat || '',
    location: obj.city || obj.gouvernorat || '',
    skills: obj.skills || [],
    rating: avgRating,
    reviewCount: ratings.length,
    reputationScore: obj.reputationScore || 0,
    completedHelps: obj.completedHelps || 0, 
    cancelledHelps: obj.cancelledHelps || 0,
    role: obj.role,
    profileImageUrl: obj.profileImageUrl || '',
    phone: obj.phone || '',
    bio: obj.bio || '',
    memberSince: obj.createdAt,
  };
}

module.exports = router;
