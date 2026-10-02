import "dotenv/config";
import { connectDB } from "../src/connections/connectDB.js";
import { CompetitionModel } from "../src/models/Competition.model.js";
import { userModel } from "../src/models/User.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// ─── Helpers ────────────────────────────────────────────
const days = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const buildRewards = (pool) => {
  const splits = [0.36, 0.2, 0.16, 0.13, 0.09, 0.06];
  const labels = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
  return splits.map((pct, i) => ({
    rank: i + 1,
    description: `${labels[i]} Winner`,
    cashValue: Math.round(pool * pct),
  }));
};

// ─── Winner roster (shared across competitions) ─────────
// Each winner is tagged with the categories they've competed in.
// Real winners often compete in multiple categories — reflects that.
const WINNER_ROSTER = [
  { name: "Riya Shah", img: 32, categories: ["Dance", "Art"] },
  { name: "Aarav Mehta", img: 12, categories: ["Dance", "Music"] },
  { name: "Neha Verma", img: 45, categories: ["Dance"] },
  { name: "Ishita Chopra", img: 28, categories: ["Dance", "Art"] },
  { name: "Priya Nair", img: 44, categories: ["Music"] },
  { name: "Karan Singh", img: 15, categories: ["Music", "Comedy"] },
  { name: "Aditya Khanna", img: 33, categories: ["Photography"] },
  { name: "Meera Joshi", img: 26, categories: ["Photography", "Art"] },
  { name: "Rohan Patel", img: 68, categories: ["Photography"] },
  { name: "Sneha Reddy", img: 49, categories: ["Literature"] },
  { name: "Arjun Das", img: 51, categories: ["Literature", "Comedy"] },
  { name: "Tanvi Kapoor", img: 9, categories: ["Art", "Photography"] },
];

const seed = async () => {
  try {
    await connectDB();
    await CompetitionModel.deleteMany({});
    await userModel.deleteMany({});
    console.log("Cleared old data");

    // ─── Judges ─────────────────────────────────────────
    const judge1 = await userModel.create({
      name: "Manju Dubey",
      username: "manju_dubey",
      email: "manju@feedants.com",
      passwordHash: await bcrypt.hash("judge", 10),
      role: "judge",
      avatarUrl: "https://i.pravatar.cc/200?img=47",
      judgeProfile: {
        title: "Professional Kathak Dancer",
        experience: "12+ Years",
      },
    });

    const judge2 = await userModel.create({
      name: "Ananya Iyer",
      username: "ananya_iyer",
      email: "ananya@feedants.com",
      passwordHash: await bcrypt.hash("judge", 10),
      role: "judge",
      avatarUrl: "https://i.pravatar.cc/200?img=44",
      judgeProfile: {
        title: "Hindustani Vocalist",
        experience: "15+ Years",
      },
    });

    const judge3 = await userModel.create({
      name: "Vikram Rao",
      username: "vikram_rao",
      email: "vikram@feedants.com",
      passwordHash: await bcrypt.hash("judge", 10),
      role: "judge",
      avatarUrl: "https://i.pravatar.cc/200?img=13",
      judgeProfile: {
        title: "Documentary Photographer",
        experience: "10+ Years",
      },
    });

    // ─── Test user (for demoing registration) ───────────
    const testUser = await userModel.create({
      name: "Test User",
      username: "test",
      email: "test@feedants.com",
      passwordHash: await bcrypt.hash("test", 10),
      role: "user",
    });

    // ─── Winner users ───────────────────────────────────
    const winnerUsers = [];
    for (const w of WINNER_ROSTER) {
      const user = await userModel.create({
        name: w.name,
        username: w.name.toLowerCase().replace(/\s+/g, "_"),
        email: `${w.name.split(" ")[0].toLowerCase()}@feedants.com`,
        passwordHash: await bcrypt.hash("winner", 10),
        role: "user",
        avatarUrl: `https://i.pravatar.cc/200?img=${w.img}`,
      });
      winnerUsers.push({ ...w, userId: user._id, avatarUrl: user.avatarUrl });
    }

    // ─── Winner selector by category ────────────────────
    // Returns 4 winners matching the category. If fewer than 4 match,
    // fills the rest with winners from the full roster (no duplicates).
    const pickWinners = (category, count = 4) => {
      const matching = winnerUsers.filter((w) =>
        w.categories.includes(category),
      );

      const picked = [...matching];

      // Fill remaining slots from the whole roster, skipping duplicates
      if (picked.length < count) {
        for (const w of winnerUsers) {
          if (picked.length >= count) break;
          if (!picked.includes(w)) picked.push(w);
        }
      }

      return picked.slice(0, count).map((w, i) => ({
        userId: w.userId,
        name: w.name,
        rank: i + 1,
        year: 2025,
        imageUrl: w.avatarUrl,
      }));
    };

    // ─── Shared tab content ─────────────────────────────
    const commonTabs = {
      judgingParameters: [
        "Technique and form",
        "Expression and stage presence",
        "Rhythm and timing",
        "Presentation quality",
      ],
      rulesAndEligibility: [
        "Open to all age groups",
        "Solo performances only",
        "Video submissions must be under 5 minutes",
        "Original work encouraged",
      ],
    };

    // ─── Competition configs — all 5 lifecycle states ───
    const configs = [
      {
        title: "Feedants Classical Dance",
        category: "Dance",
        tags: ["Dance", "Multi-Win"],
        prizePool: 1500,
        entryFee: 99,
        totalSlot: 20,
        bookedSlots: 2,
        judge: judge1,
        dates: {
          registrationCloses: days(2),
          submissionStarts: days(3),
          submissionEnds: days(27),
          resultDate: days(32),
        },
        about:
          "This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance. All submissions will be judged by a panel of professional dancers based on technique, expression, and stage presence.",
      },
      {
        title: "Feedants Solo Singing",
        category: "Music",
        tags: ["Singing", "Solo"],
        prizePool: 2000,
        entryFee: 149,
        totalSlot: 15,
        bookedSlots: 15,
        judge: judge2,
        dates: {
          registrationCloses: days(4),
          submissionStarts: days(5),
          submissionEnds: days(28),
          resultDate: days(33),
        },
        about:
          "Showcase your voice in this solo singing competition. Any genre welcome — classical, Bollywood, indie, or original compositions. Judges will evaluate pitch, emotion, and stage presence.",
      },
      {
        title: "Feedants Street Photography",
        category: "Photography",
        tags: ["Photography", "Open"],
        prizePool: 3000,
        entryFee: 199,
        totalSlot: 40,
        bookedSlots: 38,
        judge: judge3,
        dates: {
          registrationCloses: days(-3),
          submissionStarts: days(-2),
          submissionEnds: days(10),
          resultDate: days(18),
        },
        about:
          "Submit your best street photography from the last 12 months. Judged on composition, storytelling, and technical execution. One submission per participant.",
      },
      {
        title: "Feedants Poetry Slam",
        category: "Literature",
        tags: ["Poetry", "Solo"],
        prizePool: 1200,
        entryFee: 79,
        totalSlot: 25,
        bookedSlots: 25,
        judge: judge1,
        dates: {
          registrationCloses: days(-15),
          submissionStarts: days(-14),
          submissionEnds: days(-2),
          resultDate: days(6),
        },
        about:
          "Express yourself through spoken word. Hindi, English, or any regional language. Judged on originality, delivery, and emotional impact. Results will be announced shortly.",
      },
      {
        title: "Feedants Sketch Art",
        category: "Art",
        tags: ["Sketching", "Open"],
        prizePool: 1800,
        entryFee: 99,
        totalSlot: 30,
        bookedSlots: 27,
        judge: judge3,
        dates: {
          registrationCloses: days(-40),
          submissionStarts: days(-38),
          submissionEnds: days(-20),
          resultDate: days(-5),
        },
        about:
          "This round has concluded. Congratulations to all winners. Browse their work in the Previous Winners section. Next round opens soon.",
      },
      {
        title: "Feedants Standup Comedy",
        category: "Comedy",
        tags: ["Comedy", "Solo"],
        prizePool: 2500,
        entryFee: 129,
        totalSlot: 12,
        bookedSlots: 10,
        judge: judge2,
        dates: {
          registrationCloses: days(1),
          submissionStarts: days(2),
          submissionEnds: days(15),
          resultDate: days(22),
        },
        about:
          "Got jokes? This is your stage. 3-minute original sets. Judged on writing, timing, and audience connection. Clean content only — no offensive material.",
      },
    ];

    // ─── Create competitions ────────────────────────────
    const created = [];
    for (const c of configs) {
      const comp = await CompetitionModel.create({
        title: c.title,
        category: c.category,
        tags: c.tags,
        certificate: { provided: true },
        prizePool: { total: c.prizePool, currency: "INR" },
        entryFee: { amount: c.entryFee, currency: "INR" },
        totalSlot: c.totalSlot,
        bookedSlots: c.bookedSlots,
        judge: {
          name: c.judge.name,
          title: c.judge.judgeProfile.title,
          experience: parseInt(c.judge.judgeProfile.experience),
          avatarUrl: c.judge.avatarUrl,
          introVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        dates: c.dates,
        about: c.about,
        tabs: commonTabs,
        rewards: buildRewards(c.prizePool),
        previousWinners: pickWinners(c.category, 4),
        referral: {
          enabled: true,
          baseUrl: `https://feedants.com/r/${testUser._id}`,
          discountAmount: 10,
          referrerReward: 10,
        },
      });
      created.push({ title: comp.title, id: comp._id.toString() });
    }

    // ─── Summary ────────────────────────────────────────
    console.log("\n✅ Seed complete\n");
    console.log("Competitions created:");
    created.forEach((c) => console.log(`  ${c.id}  →  ${c.title}`));
    console.log("\nCredentials:");
    console.log("  Test user:  test@feedants.com / test");
    console.log("  Judge:      manju@feedants.com / judge\n");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
