const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },           
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },    
  city: String,                                   
  reputationScore: { type: Number, default: 0 },
  completedHelps: { type: Number, default: 0 },    
  cancelledHelps: { type: Number, default: 0 },
  ratings: [{ type: Number }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profileImageUrl: String
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);