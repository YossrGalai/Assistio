const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const { sendEmail } = require("../service/emailService");

const router = express.Router();

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;
    const missingFields = [];
    if (!name || !name.trim()) missingFields.push("name");
    if (!email || !email.trim()) missingFields.push("email");
    if (!password || !password.trim()) missingFields.push("password");
    if (!city || !city.trim()) missingFields.push("city");
    if (missingFields.length) {
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingFields
      });
    }

    // verifier si email existe
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // creer utilisateur (hash mot de passe)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      city,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });
    await user.save();

    const verifyBaseUrl = process.env.VERIFY_EMAIL_BASE_URL || "http://localhost:5000/api/users";
    const verifyUrl = `${verifyBaseUrl}/verify-email?token=${verificationToken}`;

    try {
      await sendEmail({
        to: email,
        subject: "Confirmez votre email - Assistio",
        text: `Bonjour ${name || ""},\n\nMerci pour votre inscription sur Assistio.\nCliquez ici pour confirmer votre email : ${verifyUrl}\n\nSi vous n'avez pas créé de compte, ignorez ce message.`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a;">
            <h2>Bienvenue sur Assistio</h2>
            <p>Bonjour ${name || ""},</p>
            <p>Merci pour votre inscription. Cliquez sur le bouton ci-dessous pour confirmer votre email.</p>
            <p>
              <a href="${verifyUrl}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:#ffffff;border-radius:999px;text-decoration:none;">
                Confirmer mon email
              </a>
            </p>
            <p style="color:#64748b;">Si vous n'avez pas créé de compte, ignorez ce message.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.warn("Confirmation email failed:", emailError?.message || emailError);
    }

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
        profileImageUrl: user.profileImageUrl,
        emailVerified: user.emailVerified
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

// ---------------- VERIFY EMAIL ----------------
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:5173";
    const redirectToFrontend = (status) => {
      const url = `${frontendBaseUrl}/email-verified?status=${encodeURIComponent(status)}`;
      return res.redirect(url);
    };
    const sendHtml = (title, message) => {
      return res.status(200).send(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; background:#f8fafc; color:#0f172a; }
              .card { max-width: 520px; margin: 10vh auto; background:#fff; border-radius:16px; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,.08); }
              .btn { display:inline-block; margin-top:16px; padding:10px 16px; background:#2563eb; color:#fff; text-decoration:none; border-radius:999px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>${title}</h2>
              <p>${message}</p>
              <a class="btn" href="${frontendBaseUrl}">Go to app</a>
            </div>
          </body>
        </html>
      `);
    };

    if (!token) {
      if (frontendBaseUrl) return redirectToFrontend("missing-token");
      return res.status(400).json({ message: "Missing token" });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      if (frontendBaseUrl) return redirectToFrontend("invalid-or-expired");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    if (frontendBaseUrl) return redirectToFrontend("success");
    return sendHtml("Email verified", "Your email has been successfully verified.");
  } catch (err) {
    console.log(err);
    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "";
    if (frontendBaseUrl) {
      const url = `${frontendBaseUrl}/email-verified?status=server-error`;
      return res.redirect(url);
    }
    return res.status(500).json({ message: "Error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const missingFields = [];
    if (!email || !email.trim()) missingFields.push("email");
    if (!password || !password.trim()) missingFields.push("password");
    if (missingFields.length) {
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingFields
      });
    }
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

// ---------------- CHANGE PASSWORD ----------------
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password are required" });
    }

    const user = await User.findById(req.user.id || req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

// ---------------- DELETE ACCOUNT ----------------
router.delete("/account", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete user and their related data
    await User.findByIdAndDelete(req.user.id || req.user.userId);
    
    // You may want to delete related data (requests, reviews, etc.)
    // await Request.deleteMany({ userId: user._id });
    // await Review.deleteMany({ $or: [{ fromUserId: user._id }, { toUserId: user._id }] });

    res.json({ message: "Account deleted successfully" });
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
