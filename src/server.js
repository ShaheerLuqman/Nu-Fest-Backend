import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import teamRoutes from "./routes/teamRoutes.js";
//import participantRoutes from "./routes/participantRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import uploadRouter from "./controllers/uploadImage.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

const connectionString = process.env.DBPORT;
const { Pool } = pkg;

const pool = new Pool({
  connectionString,
});
pool.connect((err) => {
  if (err) {
    console.log("Error connecting to database", err);
  } else {
    console.log("Connected to database");
  }
});

// import { createTables } from "./db/db.js";
// createTables(pool);

app.get("/", (req, res) => {
  res.send("Hello Love");
});

app.use("/api/competitions", competitionRoutes);
app.use("/api/categories", categoryRoutes);
//app.use("/api/participants", participantRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/image", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
