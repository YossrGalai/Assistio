const Request = require("../models/Request");

exports.createRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      urgency,
      latitude,
      longitude,
      city,
      gouvernorat,
    } = req.body;

    const request = new Request({
      title,
      description,
      category,
      urgency,

      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },

      latitude,
      longitude,
      city,
      gouvernorat,

      createdBy: req.user?._id,
    });

    await request.save();

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    console.log("🔥 getRequests called");
    const requests = await Request.find();

    const formatted = requests.map(r => {
      console.log("RAW:", r); // 🔍 debug

      return {
        id: r._id.toString(),
        title: r.title,
        description: r.description,
        category: r.category,
        urgency: r.urgency,

        // 🔥 FORCER LES COORDONNÉES
        latitude: r.latitude || r.location?.coordinates?.[1],
        longitude: r.longitude || r.location?.coordinates?.[0],

        city: r.city,
        gouvernorat: r.gouvernorat,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getFilteredRequests = async (req, res) => {
  try {
    const { city, gouvernorat, status } = req.query;

    let filter = {};

    if (city) filter.city = city;
    if (gouvernorat) filter.gouvernorat = gouvernorat;
    if (status) filter.status = status;

    const requests = await Request.find(filter).sort({ createdAt: -1 });

    const formatRequest = (r) => ({
      ...r._doc,
      _id: r._id.toString()
    });

    const formatted = requests.map(formatRequest);
    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNearbyRequests = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    const requests = await Request.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude),
            ],
          },
          $maxDistance: parseFloat(radius) * 1000, // km → m
        },
      },
    });

    const formatRequest = (r) => ({
      ...r._doc,
      _id: r._id.toString()
    });
    const formatted = requests.map(formatRequest);
    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Request.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await Request.findByIdAndDelete(id);

    res.json({ message: "Request supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};