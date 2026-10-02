import express from "express";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import competitionRouter from "./routes/competition.routes.js";

app.use(
  cors({
    origin: "http://localhost:5173", // exact origin, NOT *
    credentials: true, // allow cookies
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/competitions", competitionRouter);

export default app;
