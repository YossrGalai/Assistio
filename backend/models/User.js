const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  city: { type: String, trim: true },
  gouvernorat: { type: String, trim: true },
  reputationScore: { type: Number, default: 0 },
  completedHelps: { type: Number, default: 0 },
  cancelledHelps: { type: Number, default: 0 },
  ratings: [{ type: Number, min: 1, max: 5 }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileImageUrl: { type: String, default: '' },
  phone: { type: String, trim: true },
  bio: { type: String, trim: true },
  skills: [{ type: String }],
}, { timestamps: true });

// Computed fields
userSchema.virtual('avatar').get(function () {
  return this.name
    ? this.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';
});

userSchema.virtual('rating').get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

userSchema.virtual('reviewCount').get(function () {
  return this.ratings ? this.ratings.length : 0;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
