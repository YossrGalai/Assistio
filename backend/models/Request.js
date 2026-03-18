const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // 🔥 Géolocalisation (format MongoDB)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    // 🔁 pour compatibilité frontend
    latitude: Number,
    longitude: Number,

    city: String,

    gouvernorat: String,

    status: {
      type: String,
      enum: ["pending", "in_progress", "done"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// 🔥 indispensable pour recherche par distance
requestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Request", requestSchema);