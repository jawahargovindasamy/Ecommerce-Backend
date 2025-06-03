import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const adminMiddleware = async (req, res, next) => {
  // const token = req.header("Authorization");
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = decoded;

    const user = await User.findById(decoded._id).select("-password");
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access Denied Only Admin Can Access" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
