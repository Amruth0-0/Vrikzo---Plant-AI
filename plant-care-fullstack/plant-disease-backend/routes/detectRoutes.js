import express from "express";
import { detectDisease } from "../controllers/detectController.js";

const router = express.Router();
router.post("/", detectDisease);
export default router;
