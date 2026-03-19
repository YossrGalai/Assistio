const express = require('express');
const mongoose = require('mongoose');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

const STATUS_MAP = {
  pending: 'ouverte', in_progress: 'en_cours', done: 'terminée',
  cancelled: 'annulée', ouverte: 'ouverte', en_cours: 'en_cours',
  terminée: 'terminée', annulée: 'annulée',
};

// 1. GET /api/requests
router.get('/', async (req, res) => {
  try {
    const { status, category, city, type, urgent } = req.query;
    const filter = {};
    if (status) {
      const reverseMap = { ouverte: 'pending', en_cours: 'in_progress', terminée: 'done', annulée: 'cancelled' };
      filter.status = reverseMap[status] || status;
    }
    if (category) filter.category = new RegExp(category, 'i');
    if (city) filter.$or = [{ city: new RegExp(city, 'i') }, { gouvernorat: new RegExp(city, 'i') }];
    if (type) filter.type = type;
    if (urgent === 'true') filter.$or = [{ urgent: true }, { urgency: 'high' }];

    const requests = await ServiceRequest.find(filter).sort({ createdAt: -1 });
    const normalized = await Promise.all(requests.map(r => normalizeRequestWithUser(r)));
    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. GET /api/requests/user/:userId ← AVANT /:id
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Chercher par string ET par ObjectId pour couvrir les deux cas
    const orConditions = [
      { createdBy: userId },
      { author: userId },
    ];

    if (mongoose.Types.ObjectId.isValid(userId)) {
      const objectId = new mongoose.Types.ObjectId(userId);
      orConditions.push({ createdBy: objectId });
      orConditions.push({ author: objectId });
    }

    const requests = await ServiceRequest.find({ $or: orConditions })
      .sort({ createdAt: -1 });

    console.log(`✅ Trouvé ${requests.length} demandes pour userId: ${userId}`);

    const normalized = await Promise.all(requests.map(r => normalizeRequestWithUser(r)));
    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. GET /api/requests/:id ← APRÈS /user/:userId
router.get('/:id', async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    const normalized = await normalizeRequestWithUser(request);
    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. POST /api/requests
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, city, gouvernorat, budget, type, urgency, image } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Titre, description et catégorie sont requis' });
    }
    const request = new ServiceRequest({
      title, description, category,
      city: city || '',
      gouvernorat: gouvernorat || '',
      location: city || gouvernorat || '',
      budget: budget || 'À négocier',
      type: type || 'service',
      urgency: urgency || 'low',
      urgent: urgency === 'high',
      image: image || '',
      author: req.user.userId,
      createdBy: req.user.userId,
      status: 'pending',
    });
    await request.save();
    const normalized = await normalizeRequestWithUser(request);
    res.status(201).json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. PUT /api/requests/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const ownerId = (request.author || request.createdBy || '').toString();
    if (ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = ['title', 'description', 'category', 'city', 'gouvernorat', 'budget', 'type', 'urgency', 'image', 'status'];
    allowedFields.forEach(f => { if (req.body[f] !== undefined) request[f] = req.body[f]; });
    if (req.body.urgency) request.urgent = req.body.urgency === 'high';
    if (req.body.city) request.location = req.body.city;
    await request.save();
    const normalized = await normalizeRequestWithUser(request);
    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 6. DELETE /api/requests/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const ownerId = (request.author || request.createdBy || '').toString();
    if (ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await request.deleteOne();
    res.json({ message: 'Request deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Helper : charge l'auteur via User.findById (fonctionne string ET ObjectId)
async function normalizeRequestWithUser(doc) {
  const r = doc.toObject ? doc.toObject() : doc;

  // Prendre author ou createdBy
  const authorId = r.author || r.createdBy;

  let authorData = {};
  if (authorId) {
    try {
      const user = await User.findById(authorId.toString())
        .select('name city profileImageUrl ratings');
      if (user) authorData = user.toObject();
    } catch {
      // ID invalide → on continue avec données vides
    }
  }

  const ratings = authorData.ratings || [];
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : 0;

  const avatarInitials = authorData.name
    ? authorData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return {
    id: r._id.toString(),
    title: r.title,
    description: r.description,
    category: (r.category || '').toLowerCase(),
    location: r.city || r.location || r.gouvernorat || '',
    city: r.city || '',
    gouvernorat: r.gouvernorat || '',
    status: STATUS_MAP[r.status] || r.status,
    budget: r.budget || 'À négocier',
    type: r.type || 'service',
    urgent: r.urgent || r.urgency === 'high',
    urgency: r.urgency || 'low',
    image: r.image || '',
    volunteersCount: r.volunteersCount || 0,
    commentsCount: r.commentsCount || 0,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    author: {
      id: authorData._id?.toString() || authorId?.toString() || '',
      name: authorData.name || 'Utilisateur',
      avatar: avatarInitials,
      rating: avgRating,
      city: authorData.city || '',
      profileImageUrl: authorData.profileImageUrl || '',
    },
  };
}

module.exports = router;