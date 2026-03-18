const express = require("express");
const router = express.Router();
const controller = require("../controllers/requestController");

router.post("/", controller.createRequest);
router.get("/", controller.getRequests);
router.get("/filter", controller.getFilteredRequests);
router.get("/nearby", controller.getNearbyRequests);

module.exports = router;