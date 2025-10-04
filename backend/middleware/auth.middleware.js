import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const isElectionOfficial = (req, res, next) => {
  if (req.user && req.user.role === "Election Official") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an Election Official" });
  }
};
