const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("config");
var validator = require("email-validator");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, passwordCheck } = req.body;

    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Some fields are not filled" });
    }
    if (!validator.validate(email)) {
      return res.status(400).json({ msg: "Incorrect email format" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long" });
    }
    if (password !== passwordCheck) {
      return res.status(400).json({ msg: "Passwords does not match" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "An account with this email already exists" });
    }
    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });
    const savedUser = newUser.save();
    res.json({ msg: "An account was successfully created" });
    return res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Some fields are not filled" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "No such account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.get("JWT_SECRET"),
      { expiresIn: 3600 }
    );
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
