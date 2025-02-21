import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();
const router = express.Router();
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // console.log('Starting upload for file:', file.originalname); // Debug line
    try {
      return {
        folder: "uploads", // Folder where images are stored in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg"],
      };
    } catch (err) {
      console.error("Error in Cloudinary params setup:", err); // Debug line
      throw err;
    }
  },
});

const upload = multer({ storage }); // Update your multer config as needed

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.API_KEY, // Replace with your Cloudinary API key
  api_secret: process.env.API_SECRET, // Replace with your Cloudinary API secret
});

// Define your route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { path, filename } = req.file;
    res.status(200).json({ url: path });
  } catch (error) {
    console.error("Cloudinary Upload Error:");
    res.status(500);
  }
});

export default router;
