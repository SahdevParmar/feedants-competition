import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "competition",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "paid", "cancelled", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const RegistrationModel = mongoose.model(
  "Registration",
  registrationSchema,
);
