import express from "express";
import { addTeam } from "../controllers/teamController.js";
const router = express.Router();
router.post("/addteam", addTeam);
//router.get("/getteams", getTeams);
export default router;
