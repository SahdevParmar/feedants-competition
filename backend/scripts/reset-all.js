import mongoose from "mongoose";
import dotenv from "dotenv";
import { CompetitionModel } from "../src/models/Competition.model.js";
import { RegistrationModel } from "../src/models/Registration.model.js";
import { userModel } from "../src/models/User.model.js";

dotenv.config();

const COMP_ID = process.argv[2];
if (!COMP_ID) {
  console.error("Usage: node scripts/reset-all.js <COMPETITION_ID>");
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Reset competition slots
  const comp = await CompetitionModel.findByIdAndUpdate(
    COMP_ID,
    { bookedSlots: 0 },
    { returnDocument: "after" },
  );
  if (!comp) {
    console.error("Competition not found");
    process.exit(1);
  }

  // 2. Delete all registrations for this competition
  const deleted = await RegistrationModel.deleteMany({
    competitionId: COMP_ID,
  });

  // 3. (Optional) Delete load test users so tokens are fresh
  //   await userModel.deleteMany({ email: { $regex: /^loadtest/ } });

  console.log(`Reset competition: ${comp.title}`);
  console.log(`  bookedSlots: ${comp.bookedSlots} / ${comp.totalSlot}`);
  console.log(`  Deleted ${deleted.deletedCount} registrations`);
  console.log(`  Deleted load test users`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
