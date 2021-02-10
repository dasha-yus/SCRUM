const jwt = require("jsonwebtoken");
const config = require("config");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "No auth token" });

    const verified = jwt.verify(token, config.get("JWT_SECRET"));
    if (!verified) return res.status(401).json({ msg: "Verification failed" });

    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = isLoggedIn;
