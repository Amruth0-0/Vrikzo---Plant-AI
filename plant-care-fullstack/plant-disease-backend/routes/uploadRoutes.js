import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join("uploads", "images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload route (matches frontend expectation)
router.post("/", upload.single("image"), uploadImage);

export default router;
