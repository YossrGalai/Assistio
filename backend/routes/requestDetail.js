const express = require('express');
const mongoose = require('mongoose');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Volunteer = require('../models/Volunteer');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

const STATUS_MAP = {
  pending: 'ouverte', in_progress: 'en_cours', done: 'terminée',
  cancelled: 'annulée', ouverte: 'ouverte', en_cours: 'en_cours',
  terminée: 'terminée', annulée: 'annulée',
};

// ─── Helper : trouver une demande par _id OU par requestId/id string ──────────
async function findRequest(id) {
  let request = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    request = await ServiceRequest.findById(id);
  }
  if (!request) {
    request = await ServiceRequest.findOne({
      $or: [{ requestId: id }, { id: id }]
    });
  }
  return request;
}

// ─── Helper : construire le filtre pour comments/volunteers ───────────────────
function buildFilter(mongoId, legacyId) {
  const conditions = [{ requestId: mongoId }];
  if (legacyId && legacyId !== mongoId) {
    conditions.push({ requestId: legacyId });
  }
  return conditions.length === 1 ? conditions[0] : { $or: conditions };
}

// GET /api/request-detail/:id
router.get('/:id', async (req, res) => {
  try {
    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    const r = request.toObject();
    const mongoId = r._id.toString();

    // Chercher le champ legacy dans TOUTES les variantes
    const legacyId = r.requestId || r.id || null;

    console.log(`🔍 mongoId: ${mongoId}, legacyId: ${legacyId}`);

    const filter = buildFilter(mongoId, legacyId);
    console.log('🔍 filtre:', JSON.stringify(filter));

    const authorId = r.author || r.createdBy;

    // Charger l'auteur
    let authorData = {};
    if (authorId) {
      try {
        const user = await User.findById(authorId.toString())
          .select('name city profileImageUrl ratings');
        if (user) authorData = user.toObject();
      } catch {}
    }

    // Charger commentaires et volunteers avec le bon filtre
    const comments = await Comment.find(filter).sort({ createdAt: 1 });
    const volunteers = await Volunteer.find(filter).sort({ createdAt: 1 });

    console.log(`✅ comments: ${comments.length}, volunteers: ${volunteers.length}`);

    // Enrichir chaque volunteer
    const enrichedVolunteers = await Promise.all(
      volunteers.map(async (v) => {
        let userData = {};
        try {
          const user = await User.findById(v.userId.toString())
            .select('name profileImageUrl ratings');
          if (user) userData = user.toObject();
        } catch {}

        const ratings = userData.ratings || [];
        const avgRating = ratings.length
          ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
          : v.rating || 0;

        const nameForAvatar = userData.name || v.userName || '';
        const avatar = nameForAvatar
          ? nameForAvatar.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
          : '??';

        return {
          id: v._id.toString(),
          userId: v.userId,
          name: userData.name || v.userName || 'Utilisateur',
          avatar,
          rating: avgRating,
          status: v.status,
        };
      })
    );

    // Formater les commentaires
    const formattedComments = comments.map(c => ({
      id: c._id.toString(),
      userId: c.userId,
      userName: c.userName || 'Utilisateur',
      avatar: c.userName
        ? c.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??',
      text: c.text,
      createdAt: c.createdAt,
    }));

    const ratings = authorData.ratings || [];
    const avgRating = ratings.length
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0;
    const authorAvatar = authorData.name
      ? authorData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      : '??';

    res.json({
      id: mongoId,
      title: r.title,
      description: r.description,
      category: r.category,
      location: r.city || r.location || r.gouvernorat || '',
      city: r.city || '',
      gouvernorat: r.gouvernorat || '',
      status: STATUS_MAP[r.status] || r.status,
      budget: r.budget || 'À négocier',
      type: r.type || 'service',
      urgent: r.urgent || r.urgency === 'high',
      urgency: r.urgency || 'low',
      image: r.image || '',
      volunteersCount: enrichedVolunteers.length,
      commentsCount: formattedComments.length,
      createdAt: r.createdAt,
      author: {
        id: authorData._id?.toString() || authorId?.toString() || '',
        name: authorData.name || 'Utilisateur',
        avatar: authorAvatar,
        rating: avgRating,
        city: authorData.city || '',
      },
      comments: formattedComments,
      volunteers: enrichedVolunteers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/request-detail/:id/comments
router.post('/:id/comments', async (req, res) => {
  try {
    const { text, userId, userName } = req.body;
    if (!text) return res.status(400).json({ message: 'Le commentaire est requis' });

    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    const mongoId = request._id.toString();

    const comment = new Comment({
      requestId: mongoId,
      userId: userId || 'anonymous',
      userName: userName || 'Utilisateur',
      text,
    });
    await comment.save();

    await ServiceRequest.findByIdAndUpdate(mongoId, { $inc: { commentsCount: 1 } });

    res.status(201).json({
      id: comment._id.toString(),
      userId: comment.userId,
      userName: comment.userName,
      avatar: comment.userName
        ? comment.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??',
      text: comment.text,
      createdAt: comment.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/request-detail/:id/volunteers/:volunteerId/accept
router.put('/:id/volunteers/:volunteerId/accept', async (req, res) => {
  try {
    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    const mongoId = request._id.toString();
    const legacyId = request.toObject().requestId || request.toObject().id || null;

    // Accepter ce volunteer
    await Volunteer.findByIdAndUpdate(req.params.volunteerId, { status: 'accepted' });

    // Refuser tous les autres — chercher par mongoId ET legacyId
    const rejectFilter = {
      $or: [
        { requestId: mongoId },
        ...(legacyId ? [{ requestId: legacyId }] : []),
      ],
      _id: { $ne: req.params.volunteerId },
    };
    await Volunteer.updateMany(rejectFilter, { status: 'rejected' });

    // Mettre le statut en in_progress
    await ServiceRequest.findByIdAndUpdate(mongoId, { status: 'in_progress' });

    res.json({ message: 'Candidat accepté' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/request-detail/:id/volunteers/:volunteerId/reject
router.put('/:id/volunteers/:volunteerId/reject', async (req, res) => {
  try {
    await Volunteer.findByIdAndUpdate(req.params.volunteerId, { status: 'rejected' });
    res.json({ message: 'Candidat refusé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/request-detail/:id/finish
router.put('/:id/finish', async (req, res) => {
  try {
    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });
    await ServiceRequest.findByIdAndUpdate(request._id, { status: 'done' });
    res.json({ message: 'Demande terminée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/request-detail/:id/cancel
router.put('/:id/cancel', async (req, res) => {
  try {
    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });
    await ServiceRequest.findByIdAndUpdate(request._id, { status: 'cancelled' });
    res.json({ message: 'Demande annulée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;