import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },

    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },

    role: {
      type: String,
      enum: ["user", "judge", "admin"],
      default: "user",
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
    },

    // Only used when role === 'judge'
    judgeProfile: {
      title: String,
      experience: String,
      avatarUrl: String,
      introVideoUrl: String,
      bio: String,
    },
  },
  { timestamps: true },
);

export const userModel = mongoose.model("User", userSchema);
