import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../src/models/User.model.js";

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  await userModel.deleteMany({ email: { $regex: /^loadtest/ } });

  const passwordHash = await bcrypt.hash("password123", 10);
  const tokens = [];

  for (let i = 0; i < 50; i++) {
    const user = await userModel.create({
      name: `Load Test ${i}`,
      username: `loadtest${i}`,
      email: `loadtest${i}@test.com`,
      passwordHash,
      role: "user",
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    tokens.push(token);
  }

  console.log("Created 50 users. Tokens:");
  console.log(JSON.stringify(tokens));
  await mongoose.disconnect();
}

main();
