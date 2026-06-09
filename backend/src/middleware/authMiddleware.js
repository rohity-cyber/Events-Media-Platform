const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Requires a valid token — blocks the request if missing or invalid
const protect =
async(req, res, next) => {

  try {

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();

    } else {

      return res.status(401).json({ message: "Not authorized" });

    }

  } catch (error) {

    return res.status(401).json({ message: "Token failed" });

  }

};

// Attaches req.user if a valid token is present, but never blocks the request
// Used on public routes where role-based filtering is needed but login is optional
const optionalAuth =
async(req, res, next) => {

  try {

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      const token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

    }

  } catch (_) {

    // Invalid token — treat as unauthenticated, don't block
    req.user = null;

  }

  next();

};

module.exports = { protect, optionalAuth };
