const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // stocké comme string
  type: {
    type: String,
    enum: ['aide_proposee', 'aide_acceptee', 'demande_terminee', 'nouveau_commentaire', 'review_recue', 'systeme'],
    default: 'systeme'
  },
  title: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['read', 'unread'], default: 'unread' },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  relatedRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

notificationSchema.pre('save', function (next) {
  this.read = this.status === 'read';
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);