const express = require('express');
const mongoose = require('mongoose');
const { Readable } = require('stream');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');
const { uploadSingleImage } = require('../middlewares/upload');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

async function isAdmin(req) {
  const User = require('../models/User');
  const userId = req.user?.userId || req.user?.id;
  if (!userId) return false;
  const me = await User.findById(userId).select('role');
  return me?.role === 'admin';
}

const STATUS_MAP = {
  pending: 'ouverte', in_progress: 'en_cours', done: 'terminée',
  cancelled: 'annulée', ouverte: 'ouverte', en_cours: 'en_cours',
  terminée: 'terminée', annulée: 'annulée',
};

const CITY_COORDS = {
  Tunis: { lat: 36.8065, lng: 10.1815 },
  Sousse: { lat: 35.8256, lng: 10.6370 },
  Sfax: { lat: 34.7406, lng: 10.7603 },
  Nabeul: { lat: 36.4510, lng: 10.7350 },
  Bizerte: { lat: 37.2744, lng: 9.8739 },
  Monastir: { lat: 35.7643, lng: 10.8113 },
  Ariana: { lat: 36.8625, lng: 10.1956 },
  Manouba: { lat: 36.8100, lng: 10.0972 },
  Gafsa: { lat: 34.4250, lng: 8.7842 },
  Kairouan: { lat: 35.6712, lng: 10.1005 },
  Gabès: { lat: 33.8881, lng: 10.0975 },
  Médenine: { lat: 33.3549, lng: 10.4957 },
  Kasserine: { lat: 35.1676, lng: 8.8365 },
  SidiBouzid: { lat: 35.0382, lng: 9.4849 },
  Jendouba: { lat: 36.5011, lng: 8.7757 },
  Kef: { lat: 36.1740, lng: 8.7046 },
  Siliana: { lat: 36.0849, lng: 9.3708 },
  Zaghouan: { lat: 36.4021, lng: 10.1429 },
  Béja: { lat: 36.7256, lng: 9.1817 },
  Mahdia: { lat: 35.5047, lng: 11.0622 },
  Tataouine: { lat: 32.9211, lng: 10.4508 },
  Tozeur: { lat: 33.9197, lng: 8.1335 },
  Kébili: { lat: 33.7042, lng: 8.9690 },
};

// ─── Helper : résout les coordonnées d'une requête ───────────────────────────
function resolveCoords(r, index = 0) {
  const cityKey = Object.keys(CITY_COORDS).find(
    k => k.toLowerCase() === (r.city || '').trim().toLowerCase()
      || k.toLowerCase() === (r.gouvernorat || '').trim().toLowerCase()
  );
  const baseCoords = CITY_COORDS[cityKey] || { lat: 36.8065, lng: 10.1815 };
  const angle = index * (2 * Math.PI / 8);
  const radius = 0.004;
  return {
    lat: baseCoords.lat + Math.cos(angle) * radius,
    lng: baseCoords.lng + Math.sin(angle) * radius,
  };
}

// ─── Helper principal : normalise avec User.findById ─────────────────────────
async function normalizeRequestWithUser(doc, index = 0) {
  const r = doc.toObject ? doc.toObject() : doc;
  const authorId = r.author || r.createdBy;

  let authorData = {};
  if (authorId) {
    try {
      const user = await User.findById(authorId.toString())
        .select('name city profileImageUrl ratings');
      if (user) authorData = user.toObject();
    } catch {
      
    }
  }

  const ratings = authorData.ratings || [];
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : 0;

  const avatarInitials = authorData.name
    ? authorData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const coords = resolveCoords(r, index);

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
    latitude: r.latitude || r.location?.coordinates?.[1] || coords.lat,
    longitude: r.longitude || r.location?.coordinates?.[0] || coords.lng,
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

//  GET /api/requests
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
    // ✅ On utilise bien le résultat de normalizeRequestWithUser
    const normalized = await Promise.all(requests.map((r, i) => normalizeRequestWithUser(r, i)));
    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//  GET /api/requests/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orConditions = [{ createdBy: userId }, { author: userId }];
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const objectId = new mongoose.Types.ObjectId(userId);
      orConditions.push({ createdBy: objectId }, { author: objectId });
    }
    const requests = await ServiceRequest.find({ $or: orConditions }).sort({ createdAt: -1 });
    const normalized = await Promise.all(requests.map((r, i) => normalizeRequestWithUser(r, i)));
    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//  GET /api/requests/:id
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

//  POST /api/requests
router.post('/', auth, uploadSingleImage, async (req, res) => {
  try {
    const { title, description, category, city, gouvernorat, budget, type, urgency, image, latitude, longitude } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Titre, description et catégorie sont requis' });
    }
    let imageUrl = image || '';
    if (req.file && req.file.buffer) {
      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'assistio' },
          (error, result) => {
            if (error) return reject(error);
            return resolve(result);
          }
        );
        Readable.from(req.file.buffer).pipe(stream);
      });
      imageUrl = uploaded.secure_url || imageUrl;
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
      image: imageUrl,
      author: req.user.userId,
      createdBy: req.user.userId,
      status: 'pending',
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
    });
    await request.save();
    const normalized = await normalizeRequestWithUser(request);
    res.status(201).json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//  PUT /api/requests/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    const ownerId = (request.author || request.createdBy || '').toString();
    if (ownerId !== req.user.userId) return res.status(403).json({ message: 'Not authorized' });
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

//  PUT /api/requests/:id/status (admin override)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (!(await isAdmin(req))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    request.status = status;
    await request.save();
    const normalized = await normalizeRequestWithUser(request);
    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//  DELETE /api/requests/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    const ownerId = (request.author || request.createdBy || '').toString();
    if (ownerId !== req.user.userId && !(await isAdmin(req))) return res.status(403).json({ message: 'Not authorized' });
    await request.deleteOne();
    res.json({ message: 'Request deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/requests/completed-as-volunteer/:userId
router.get('/completed-as-volunteer/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const Volunteer = require('../models/Volunteer');

    // Trouver toutes les demandes où ce user est volunteer accepté
    const acceptedVolunteers = await Volunteer.find({
      userId: userId,
      status: 'accepted',
    });

    const requestIds = acceptedVolunteers.map(v => v.requestId);

    // Parmi ces demandes, garder celles qui sont terminées
    const completedRequests = await ServiceRequest.find({
      _id: { $in: requestIds },
      status: { $in: ['done', 'terminée'] },
    }).populate('author', 'name city profileImageUrl ratings');

    const formatted = completedRequests.map(r => {
      const author = r.author || {};
      const ratings = author.ratings || [];
      const avgRating = ratings.length
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 0;
      const avatar = author.name
        ? author.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??';

      return {
        id: r._id.toString(),
        title: r.title,
        description: r.description,
        category: r.category,
        location: r.city || r.location || r.gouvernorat || '',
        city: r.city || '',
        gouvernorat: r.gouvernorat || '',
        status: 'terminée',
        budget: r.budget || 'À négocier',
        type: r.type || 'service',
        urgent: r.urgent || false,
        urgency: r.urgency || 'low',
        image: r.image || '',
        volunteersCount: r.volunteersCount || 0,
        commentsCount: r.commentsCount || 0,
        createdAt: r.createdAt,
        author: {
          id: author._id?.toString() || '',
          name: author.name || 'Utilisateur',
          avatar,
          rating: avgRating,
          city: author.city || '',
        },
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
