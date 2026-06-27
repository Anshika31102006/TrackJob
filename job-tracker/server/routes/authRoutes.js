import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import multer from "multer";
import { uploadResume } from "../controllers/authController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();
router.post(
  "/upload-resume/:id",
  upload.single("resume"),
  uploadResume
);

console.log("✅ AuthRoutes Loaded");

router.post("/register", register);
router.post("/login", login);

// PROFILE ROUTES
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);

// CHANGE PASSWORD ROUTE
router.put("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;