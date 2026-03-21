const express = require('express');
const mongoose = require('mongoose');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Volunteer = require('../models/Volunteer');
const Notification = require('../models/Notification');
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

// ─── Helper : envoyer une notification temps réel ─────────────────────────────
async function sendNotification(req, { targetUserId, type, title, message, relatedRequestId, fromUserId }) {
  try {
    const notif = new Notification({
      userId: targetUserId.toString(),
      type,
      title,
      message,
      relatedRequest: relatedRequestId || undefined,
      fromUser: fromUserId || undefined,
    });
    await notif.save();

    const io = req.app.get('io');
    if (io) {
      io.to(targetUserId.toString()).emit('new_notification', {
        id: notif._id.toString(),
        type,
        title,
        message,
        read: false,
        createdAt: notif.createdAt.toISOString(),
      });
    }
  } catch (err) {
    console.error('Erreur envoi notification:', err.message);
  }
}

// GET /api/request-detail/:id
router.get('/:id', async (req, res) => {
  try {
    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    const r = request.toObject();
    const mongoId = r._id.toString();
    const legacyId = r.requestId || r.id || null;

    const filter = buildFilter(mongoId, legacyId);

    const authorId = r.author || r.createdBy;

    let authorData = {};
    if (authorId) {
      try {
        const user = await User.findById(authorId.toString())
          .select('name city profileImageUrl ratings');
        if (user) authorData = user.toObject();
      } catch {}
    }

    const comments = await Comment.find(filter).sort({ createdAt: 1 });
    const volunteers = await Volunteer.find(filter).sort({ createdAt: 1 });

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
          userId: v.userId.toString(),
          name: userData.name || v.userName || 'Utilisateur',
          avatar,
          rating: avgRating,
          status: v.status,
        };
      })
    );

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

// POST /api/request-detail/:id/apply
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const userId = req.user.id.toString();

    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    if (STATUS_MAP[request.status] !== 'ouverte' && request.status !== 'ouverte') {
      return res.status(400).json({ message: "Cette demande n'est plus ouverte" });
    }

    const mongoId = request._id.toString();
    const legacyId = request.toObject().requestId || request.toObject().id || null;
    const filter = buildFilter(mongoId, legacyId);

    // Vérifier si déjà postulé
    const alreadyApplied = await Volunteer.findOne({ ...filter, userId });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Vous avez déjà postulé' });
    }

    const user = await User.findById(userId).select('name rating');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const avatar = user.name
      .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    // Créer le volunteer en DB
    const newVolunteer = new Volunteer({
      requestId: mongoId,
      userId,
      userName: user.name,
      rating: user.rating || 0,
      status: 'pending',
    });
    await newVolunteer.save();

    // Notifier le propriétaire de la demande
    const authorId = request.author?.toString() || request.createdBy?.toString();
    if (authorId && authorId !== userId) {
      await sendNotification(req, {
        targetUserId: authorId,
        type: 'aide_proposee',
        title: 'Nouvelle candidature',
        message: `${user.name} a postulé à votre demande "${request.title}"`,
        relatedRequestId: request._id,
        fromUserId: userId,
      });
    }

    res.status(201).json({
      id: newVolunteer._id.toString(),
      userId,
      name: user.name,
      avatar,
      rating: user.rating || 0,
      status: 'pending',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/request-detail/:id/comments
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Le commentaire est requis' });

    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    const userId = req.user.id.toString();
    const user = await User.findById(userId).select('name');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const mongoId = request._id.toString();

    const comment = new Comment({
      requestId: mongoId,
      userId,
      userName: user.name,
      text,
    });
    await comment.save();

    await ServiceRequest.findByIdAndUpdate(mongoId, { $inc: { commentsCount: 1 } });

    const avatar = user.name
      .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    res.status(201).json({
      id: comment._id.toString(),
      userId,
      userName: user.name,
      avatar,
      text: comment.text,
      createdAt: comment.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/request-detail/:id/volunteers/:volunteerId/accept
router.put('/:id/volunteers/:volunteerId/accept', auth, async (req, res) => {
  try {
    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    const mongoId = request._id.toString();
    const legacyId = request.toObject().requestId || request.toObject().id || null;

    const volunteer = await Volunteer.findById(req.params.volunteerId);
    if (!volunteer) return res.status(404).json({ message: 'Candidat introuvable' });

    // Accepter ce volunteer
    await Volunteer.findByIdAndUpdate(req.params.volunteerId, { status: 'accepted' });

    // Refuser tous les autres
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

    // Notifier le volunteer accepté
    const volunteerId = volunteer.userId?.toString();
    if (volunteerId) {
      await sendNotification(req, {
        targetUserId: volunteerId,
        type: 'aide_acceptee',
        title: 'Candidature acceptée !',
        message: `Votre candidature pour "${request.title}" a été acceptée`,
        relatedRequestId: request._id,
        fromUserId: req.user.id,
      });
    }

    // Notifier les autres volunteers refusés
    const rejectedVolunteers = await Volunteer.find({
      ...rejectFilter,
      status: 'rejected',
    });
    for (const rv of rejectedVolunteers) {
      if (rv.userId?.toString()) {
        await sendNotification(req, {
          targetUserId: rv.userId.toString(),
          type: 'systeme',
          title: 'Candidature non retenue',
          message: `Votre candidature pour "${request.title}" n'a pas été retenue`,
          relatedRequestId: request._id,
          fromUserId: req.user.id,
        });
      }
    }

    res.json({ message: 'Candidat accepté' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/request-detail/:id/volunteers/:volunteerId/reject
router.put('/:id/finish', auth, async (req, res) => {
  try {
    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    await ServiceRequest.findByIdAndUpdate(request._id, { status: 'done' });

    const mongoId = request._id.toString();
    const acceptedVolunteer = await Volunteer.findOne({ requestId: mongoId, status: 'accepted' });
    
    if (acceptedVolunteer?.userId) {
      const volunteerId = acceptedVolunteer.userId.toString();

      // Incrémenter completedHelps
      await User.findByIdAndUpdate(volunteerId, {
        $inc: { completedHelps: 1 }
      });

      await sendNotification(req, {
        targetUserId: volunteerId,
        type: 'demande_terminee',
        title: 'Mission terminée',
        message: `La demande "${request.title}" a été marquée comme terminée`,
        relatedRequestId: request._id,
        fromUserId: req.user.id,
      });
    }

    res.json({ message: 'Demande terminée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/request-detail/:id/finish
router.put('/:id/finish', auth, async (req, res) => {
  try {
    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    await ServiceRequest.findByIdAndUpdate(request._id, { status: 'done' });

    // Notifier le volunteer accepté que la demande est terminée
    const mongoId = request._id.toString();
    const acceptedVolunteer = await Volunteer.findOne({ requestId: mongoId, status: 'accepted' });
    if (acceptedVolunteer?.userId) {
      await sendNotification(req, {
        targetUserId: acceptedVolunteer.userId.toString(),
        type: 'demande_terminee',
        title: 'Mission terminée',
        message: `La demande "${request.title}" a été marquée comme terminée`,
        relatedRequestId: request._id,
        fromUserId: req.user.id,
      });
    }

    res.json({ message: 'Demande terminée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/request-detail/:id/cancel
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const request = await findRequest(req.params.id);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    await ServiceRequest.findByIdAndUpdate(request._id, { status: 'cancelled' });

    // Notifier le volunteer accepté si existant
    const mongoId = request._id.toString();
    const acceptedVolunteer = await Volunteer.findOne({ requestId: mongoId, status: 'accepted' });
    if (acceptedVolunteer?.userId) {
      await sendNotification(req, {
        targetUserId: acceptedVolunteer.userId.toString(),
        type: 'systeme',
        title: 'Demande annulée',
        message: `La demande "${request.title}" a été annulée`,
        relatedRequestId: request._id,
        fromUserId: req.user.id,
      });
    }

    res.json({ message: 'Demande annulée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;