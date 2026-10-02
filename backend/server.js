import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/connections/connectDB.js";

const port = process.env.PORT;

app.listen(port, () => {
  console.log("server on", port);
});

connectDB();
