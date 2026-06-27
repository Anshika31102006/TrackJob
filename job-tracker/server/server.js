import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

console.log("✅ Server file running");

// Needed for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded resumes — force inline display for PDFs and images
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
    } else if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      res.setHeader("Content-Disposition", "inline");
    } else if ([".doc", ".docx"].includes(ext)) {
      res.setHeader("Content-Disposition", "inline");
    }
  },
}));

// Test Route
app.get("/", (req, res) => {
  res.send("MY SERVER IS RUNNING");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://anshika:AO31jee%23adv@trackjob.nj8jegc.mongodb.net/jobtracker"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// Server
app.listen(5001, () => {
  console.log("🚀 Server running on port 5001");
});