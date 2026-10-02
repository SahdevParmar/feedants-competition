import mongoose from "mongoose";

const judgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    experience: { type: Number, required: true },
    avatarUrl: { type: String, required: true, trim: true },
    introVideoUrl: { type: String, trim: true },
  },
  { _id: false },
);

const datesSchema = new mongoose.Schema(
  {
    registrationCloses: { type: Date, required: true },
    submissionStarts: { type: Date, required: true },
    submissionEnds: { type: Date, required: true },
    resultDate: { type: Date, required: true },
  },
  { _id: false },
);

const referralSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    baseUrl: { type: String, trim: true },
    discountAmount: { type: Number, default: 0 },
    referrerReward: { type: Number, default: 0 },
  },
  { _id: false },
);

const competitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true },
    tags: [{ type: String, trim: true }],

    certificate: {
      provided: { type: Boolean, default: true },
      templateUrl: { type: String, trim: true },
    },

    prizePool: {
      total: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "INR", trim: true },
    },

    entryFee: {
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "INR", trim: true },
    },

    totalSlot: { type: Number, required: true, min: 1 },
    bookedSlots: { type: Number, default: 0, min: 0 },

    judge: { type: judgeSchema, required: true },

    dates: { type: datesSchema, required: true },

    about: { type: String, required: true, trim: true },

    tabs: {
      judgingParameters: [{ type: String, trim: true }],
      rulesAndEligibility: [{ type: String, trim: true }],
    },

    rewards: [
      {
        rank: { type: Number, required: true },
        description: { type: String, required: true },
        cashValue: { type: Number, min: 0 },
      },
    ],

    previousWinners: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        name: { type: String, required: true },
        rank: { type: Number, required: true },
        year: { type: Number, required: true },
        imageUrl: { type: String, trim: true },
      },
    ],

    referral: { type: referralSchema, default: () => ({}) },
  },
  { timestamps: true },
);

competitionSchema.virtual("isFull").get(function () {
  return this.bookedSlots >= this.totalSlot;
});

export const CompetitionModel = mongoose.model(
  "competition",
  competitionSchema,
);
