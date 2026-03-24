const mongoose = require("mongoose");

RequestSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});
res.json(requests);

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

    image: {
      type: String,
    },

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
