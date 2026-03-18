const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  id: { type: String },  // legacy string id from DB
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  location: { type: String, trim: true },
  city: { type: String, trim: true },
  gouvernorat: { type: String, trim: true },
  latitude: { type: Number },
  longitude: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'done', 'cancelled', 'ouverte', 'en_cours', 'terminée', 'annulée'],
    default: 'pending'
  },
  urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  urgent: { type: Boolean, default: false },
  budget: { type: String },
  type: { type: String, enum: ['service', 'recherche'], default: 'service' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  volunteersCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  image: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Map DB status to frontend status labels
serviceRequestSchema.virtual('statusFR').get(function () {
  const map = {
    pending: 'ouverte',
    in_progress: 'en_cours',
    done: 'terminée',
    cancelled: 'annulée',
    ouverte: 'ouverte',
    en_cours: 'en_cours',
    terminée: 'terminée',
    annulée: 'annulée',
  };
  return map[this.status] || this.status;
});

serviceRequestSchema.set('toJSON', { virtuals: true });
serviceRequestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema, 'requests');