const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String },
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema, 'volunteers');