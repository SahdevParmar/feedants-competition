import { CompetitionModel } from "../models/Competition.model.js";
import { RegistrationModel } from "../models/Registration.model.js";

export const getCompetitions = async (req, res) => {
  try {
    const competitions = await CompetitionModel.find().select("-__v");
    return res.status(200).json({ competitions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const competitionById = async (req, res) => {
  try {
    const competition = await CompetitionModel.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: "Competition does not exist" });
    }

    const { dates, totalSlot, bookedSlots } = competition;
    const slotsLeft = totalSlot - bookedSlots;
    const now = new Date();

    let state;
    if (now < dates.registrationCloses) {
      state = slotsLeft === 0 ? "FULL" : "REGISTRATION_OPEN";
    } else if (now < dates.submissionEnds) {
      state = "SUBMISSION_PHASE";
    } else if (now < dates.resultDate) {
      state = "JUDGING";
    } else {
      state = "RESULTS_PUBLISHED";
    }

    let isRegistered = false;
    if (req.user) {
      const reg = await RegistrationModel.findOne({
        userId: req.user._id,
        competitionId: competition._id,
      });
      isRegistered = !!reg;
    }

    const canRegister = state === "REGISTRATION_OPEN" && !isRegistered;

    return res.status(200).json({
      competition,
      state,
      slotsLeft,
      userState: { isRegistered, canRegister },
    });
  } catch (error) {
    console.error("competitionById error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const registerForCompetition = async (req, res) => {
  try {
    const competition = await CompetitionModel.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: "Competition does not exist" });
    }
    const now = new Date();
    if (!(now < competition.dates.registrationCloses)) {
      return res.status(400).json({ error: "Registration closed" });
    }

    const updated = await CompetitionModel.findOneAndUpdate(
      {
        _id: req.params.id,
        $expr: { $lt: ["$bookedSlots", "$totalSlot"] },
      },
      {
        $inc: { bookedSlots: 1 },
      },
      { returnDocument: "after" },
    );
    if (!updated) {
      return res.status(409).json({ error: "competition is full" });
    }
    await RegistrationModel.create({
      competitionId: updated._id,
      userId: req.user._id,
      status: "paid",
    })
      .then(() => {
        return res.status(200).json({
          success: true,
          slotsLeft: updated.totalSlot - updated.bookedSlots,
        });
      })
      .catch(async (err) => {
        await CompetitionModel.updateOne(
          {
            _id: req.params.id,
          },
          {
            $inc: { bookedSlots: -1 },
          },
        );
        if (err.code === 11000) {
          return res.status(409).json({ error: "You are already registered" });
        }
        console.error("Registration create failed:", err);
        return res.status(500).json({ error: err.message });
      });
  } catch (err) {
    console.error("Registration create failed:", err);
    return res.status(500).json({ error: err.message });
  }
};
