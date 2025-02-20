const express = require("express");
const passport = require("../middlewares/googleAuth");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Google OAuth Redirect (for frontend button click)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { user, token } = req.user;

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}`);
  }
);

/*// API Route for Google Signup/Login (for frontend direct request)
router.post("/google-login", async (req, res) => {
  try {
    const { tokenId } = req.body;
    const decoded = jwt.verify(tokenId, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Generate new token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
});*/

router.post("/google-login", async (req, res) => {
    try {
      const { credential } = req.body; // Match frontend's key

      
      // Verify the Google ID token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches the client ID
      });
      
      const payload = ticket.getPayload(); // Contains user information from Google
  
      let user = await User.findOne({ email: payload.email });
      if (!user) {
        // Create new user if not found
        user = new User({
          fullName: {
            firstName: payload.given_name,
            lastName: payload.family_name || "",
          },
          email: payload.email,
        });
        await user.save();
      }
  
      // Generate your own JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
  
      res.status(200).json({ token, user });
    } catch (error) {
      console.error("Error during Google login: ", error);
      res.status(400).json({ message: "Invalid Token" });
    }
});

module.exports = router;
