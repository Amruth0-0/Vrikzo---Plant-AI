import express from "express";
import { registerEmail } from "../controllers/userEmailController.js";

const router = express.Router();

router.post("/registerEmail", registerEmail);

export default router;
