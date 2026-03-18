const express = require('express');
const ServiceRequest = require('../models/ServiceRequest');
const auth = require('../middleware/auth');

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

    const requests = await ServiceRequest.find(filter)
      .populate('author', 'name city profileImageUrl ratings')
      .populate('createdBy', 'name city profileImageUrl ratings')
      .sort({ createdAt: -1 });
    res.json(requests.map(normalizeRequest));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. GET /api/requests/user/:userId  ← AVANT /:id
router.get('/user/:userId', async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      $or: [
        { author: req.params.userId },
        { createdBy: req.params.userId },
      ]
    })
      .populate('author', 'name city profileImageUrl ratings')
      .populate('createdBy', 'name city profileImageUrl ratings')
      .sort({ createdAt: -1 });
    res.json(requests.map(normalizeRequest));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. GET /api/requests/:id  ← APRÈS /user/:userId
router.get('/:id', async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('author', 'name city profileImageUrl ratings')
      .populate('createdBy', 'name city profileImageUrl ratings')
      .populate('assignedTo', 'name city profileImageUrl');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(normalizeRequest(request));
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
    await request.populate('author', 'name city profileImageUrl ratings');
    res.status(201).json(normalizeRequest(request));
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

    // Vérifier author OU createdBy
    const ownerId = request.author?.toString() || request.createdBy?.toString();
    if (ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = ['title', 'description', 'category', 'city', 'gouvernorat', 'budget', 'type', 'urgency', 'image', 'status'];
    allowedFields.forEach(f => { if (req.body[f] !== undefined) request[f] = req.body[f]; });
    if (req.body.urgency) request.urgent = req.body.urgency === 'high';
    if (req.body.city) request.location = req.body.city;
    await request.save();
    await request.populate('author', 'name city profileImageUrl ratings');
    res.json(normalizeRequest(request));
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

    // Vérifier author OU createdBy
    const ownerId = request.author?.toString() || request.createdBy?.toString();
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

// ─── Helper ───────────────────────────────────────────────────────────────────
function normalizeRequest(doc) {
  const r = doc.toObject ? doc.toObject() : doc;

  // Accepter author OU createdBy selon ce qui est peuplé
  const author =
    (r.author && typeof r.author === 'object' && r.author.name)
      ? r.author
      : (r.createdBy && typeof r.createdBy === 'object' && r.createdBy.name)
      ? r.createdBy
      : {};

  const ratings = author.ratings || [];
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : 0;

  const avatarInitials = author.name
    ? author.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
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
      id: author._id?.toString() || '',
      name: author.name || 'Utilisateur',
      avatar: avatarInitials,
      rating: avgRating,
      city: author.city || '',
      profileImageUrl: author.profileImageUrl || '',
    },
  };
}

module.exports = router;