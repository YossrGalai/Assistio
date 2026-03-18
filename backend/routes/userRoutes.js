const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const authMiddleware = require("../middlewares/authMiddleware"); 

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // vérifier si email existe
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // créer utilisateur
    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "User registered", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password }); // ⚠️ hash en vrai
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

// ---------------- GET PROFILE ----------------
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

// ---------------- UPDATE PROFILE ----------------
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, password } = req.body;
    if (name) user.name = name;
    if (password) user.password = password; // ⚠️ hash en vrai
    await user.save();

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

// ---------------- UPDATE REPUTATION ----------------
router.post("/reputation", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { points, action } = req.body;
    user.score += points;
    user.history.push({ action, points, date: new Date() });

    // exemple badges
    if (user.score >= 50 && !user.badges.includes("Trusted")) {
      user.badges.push("Trusted");
    }

    await user.save();
    res.json({ message: "Reputation updated", score: user.score, badges: user.badges, history: user.history });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;