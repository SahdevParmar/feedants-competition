import { userModel } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function signupController(req, res) {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(422).json({ message: "Please fill all details" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const usernameExists = await userModel.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const user = await userModel.create({
      name,
      email,
      username,
      passwordHash: await bcrypt.hash(password, 10),
      role: "user",
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // must be false on localhost HTTP
      sameSite: "lax",
    });
    return res.status(200).json({
      message: "signup success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      // no token in JSON — it's in the cookie
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function loginController(req, res) {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(422).json({ message: "Please fill all details" });
    }

    const query = email ? { email } : { username };
    const user = await userModel.findOne(query);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist, please register." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // must be false on localhost HTTP
      sameSite: "lax",
    });
    return res.status(201).json({
      message: "loggin success",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      // no token in JSON — it's in the cookie
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export const logoutController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const meController = (req, res) => {
  // authMiddleware already attached req.user (passwordHash excluded)
  return res.status(200).json({ user: req.user });
};
