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
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

// Only allow image MIME types
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Unsupported file type: ${file.mimetype}. Only JPEG, PNG, WebP, and GIF images are allowed.`),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

// Upload route (matches frontend expectation)
router.post("/", upload.single("image"), uploadImage);

// Handle multer errors (file type / size violations) with clean JSON responses
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large. Maximum size is 5 MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(415).json({ error: err.message });
  }
  next();
});

export default router;

