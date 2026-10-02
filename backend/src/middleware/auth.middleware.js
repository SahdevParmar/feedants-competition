import jwt from "jsonwebtoken";
import { userModel } from "../models/User.model.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "unauthorized, please login or signup" });
  }
  let user;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    user = await userModel.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      return res
        .status(401)
        .json({ message: "unauthorized, please login or signup" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  req.user = user;
  next();
};
