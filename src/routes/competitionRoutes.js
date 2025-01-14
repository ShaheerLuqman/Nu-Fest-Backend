import express from "express";
import {
  //addCompetition,
  getCompetitionCategory,
  getCompetitions,
} from "../controllers/competitionController.js";
const router = express.Router();

//router.post("/addcompetition", addCompetition);
router.get("/getcompetitions", getCompetitions);
router.get("/getcompetitioncategory", getCompetitionCategory);
// router.get("/getcompetition/:id", getCompetition);
export default router;
