const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String },
  text: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema, 'comments');