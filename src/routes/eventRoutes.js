import express from "express";
import { addEventParticipant, getEvents, getEventTickets } from "../controllers/eventController.js";

const router = express.Router();

router.get("/getevents", getEvents);
router.get("/geteventtickets", getEventTickets);
router.post("/addeventparticipant", addEventParticipant);
export default router;
