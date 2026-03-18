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
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
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

    res.json(requests);
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

    res.json(requests);
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