const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // Compare the provided password with the hashed password in the database
    const validated = await bcrypt.compare(password, user.password);
    if (!validated) {
      return res.status(400).json({ error: "Wrong credentials." });
    }

    // If login is successful, send back user data without the password
    const { password: hashedPass, ...userData } = user._doc;
    return res.status(200).json(userData);
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;