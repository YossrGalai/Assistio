const express = require('express');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const Review = require('../models/Review');
const Volunteer = require('../models/Volunteer');
const Category = require('../models/Category');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

async function isAdmin(req) {
  const userId = req.user?.userId || req.user?.id;
  if (!userId) return false;
  const me = await User.findById(userId).select('role');
  return me?.role === 'admin';
}

function normalizeStatus(status) {
  const map = {
    pending: 'en attente',
    ouverte: 'en attente',
    in_progress: 'en cours',
    en_cours: 'en cours',
    done: 'terminé',
    terminée: 'terminé',
    cancel: 'terminé',
    cancelled: 'terminé',
    annulée: 'terminé',
  };
  return map[status] || 'en attente';
}

router.get('/', auth, async (req, res) => {
  if (!(await isAdmin(req))) return res.status(403).json({ message: 'Admin access required' });
  try {
    const [users, requests, reviews, categories] = await Promise.all([
      User.find().select('isBlocked createdAt'),
      ServiceRequest.find().sort({ createdAt: -1 }),
      Review.find().sort({ createdAt: -1 }),
      Category.find().sort({ name: 1 }),
    ]);

    const totalUsers = users.length;
    const totalRequests = requests.length;
    const activeUsers = users.filter((user) => !user.isBlocked).length;

    const requestsByStatus = {
      'en attente': 0,
      'en cours': 0,
      'terminé': 0,
    };

    requests.forEach((request) => {
      const key = normalizeStatus(request.status);
      requestsByStatus[key] = (requestsByStatus[key] || 0) + 1;
    });

    const last14Days = Array.from({ length: 14 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - index));
      return date;
    });

    const requestsCreatedOverTime = last14Days.map((date) => {
      const dayKey = date.toISOString().slice(0, 10);
      const count = requests.filter((request) => new Date(request.createdAt).toISOString().slice(0, 10) === dayKey).length;
      return {
        label: date.toLocaleDateString('fr-TN', { day: '2-digit', month: 'short' }),
        value: count,
      };
    });

    const categoryCounts = new Map();
    requests.forEach((request) => {
      const key = (request.category || 'Sans catégorie').trim();
      categoryCounts.set(key, (categoryCounts.get(key) || 0) + 1);
    });
    const mostActiveCategories = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));

    const recentRequests = requests.slice(0, 8).map((request) => ({
      id: `req-${request._id.toString()}`,
      type: 'new_request',
      title: 'Nouvelle demande publiée',
      description: request.title,
      createdAt: request.createdAt,
    }));

    const recentReviews = reviews.slice(0, 5).map((review) => ({
      id: `rev-${review._id.toString()}`,
      type: 'review',
      title: 'Nouvel avis',
      description: review.comment,
      createdAt: review.createdAt,
    }));

    const recentVolunteers = await Volunteer.find().sort({ createdAt: -1 }).limit(8);
    const recentParticipations = recentVolunteers.map((volunteer) => ({
      id: `vol-${volunteer._id.toString()}`,
      type: volunteer.status === 'accepted' ? 'accepted' : 'new_participation',
      title: volunteer.status === 'accepted' ? 'Volontaire accepté' : 'Nouvelle participation',
      description: volunteer.userName || volunteer.userId,
      createdAt: volunteer.createdAt,
    }));

    const recentActivities = [...recentRequests, ...recentParticipations, ...recentReviews]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 12);

    res.json({
      totalUsers,
      totalRequests,
      activeUsers,
      requestsByStatus,
      requestsCreatedOverTime,
      mostActiveCategories,
      recentActivities,
      categoryCount: categories.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
