// backend/scripts/reset-slots.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { CompetitionModel } from "../src/models/Competition.model.js";

dotenv.config();

const ID = process.argv[2]; // pass competition id as CLI arg

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const c = await CompetitionModel.findByIdAndUpdate(
    ID,
    { bookedSlots: 0 },
    { returnDocument: "after" },
  );
  console.log(
    `Reset ${c.title} → bookedSlots: ${c.bookedSlots}, totalSlot: ${c.totalSlot}`,
  );
  await mongoose.disconnect();
}

main();
