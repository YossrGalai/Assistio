const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    // verifier si email existe
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // creer utilisateur (hash mot de passe)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword, city });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      message: "User registered",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        role: user.role,
        reputationScore: user.reputationScore,
        completedHelps: user.completedHelps,
        profileImageUrl: user.profileImageUrl
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Trying to login:", email, password);
    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }
    // Migration for legacy plaintext passwords
    if (!isMatch && user.password === password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      isMatch = true;
    }
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        role: user.role,
        reputationScore: user.reputationScore,
        completedHelps: user.completedHelps,
        profileImageUrl: user.profileImageUrl
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

// ---------------- GET PROFILE ----------------
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user.userId);
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
    const user = await User.findById(req.user.id || req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, password } = req.body;
    if (name) user.name = name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
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
    const user = await User.findById(req.user.id || req.user.userId);
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
