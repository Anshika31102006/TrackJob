import express from "express";
import Job from "../models/Job.js";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { parsePdfResume } from "../utils/resumeParser.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// =======================
// VIEW RESUME INLINE
// =======================
router.get("/view-resume/:filename", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../uploads", req.params.filename);
    const options = {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=" + req.params.filename,
      }
    };
    res.sendFile(filePath, options, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        if (!res.headersSent) {
          res.status(404).send("<h3>File not found or cannot be loaded.</h3>");
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multer Config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
    );
  },
});

const upload = multer({ storage });

// =======================
// RESUME PARSER
// =======================
router.post(
  "/parse-resume",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No resume file uploaded" });
      }
      const result = await parsePdfResume(req.file.path);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// =======================
// CREATE JOB
// =======================
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log(req.body);

      const job = new Job({
        company: req.body.company,
        role: req.body.role,
        status: req.body.status,
        jobSpec: req.body.jobSpec,
        oaStatus: req.body.oaStatus,
        interviewCall: req.body.interviewCall,
        userId: req.user.id, // Attach the user's ID to the job application

        resume: req.files?.resume
          ? req.files.resume[0].filename
          : null,

        companyLogo: req.files?.companyLogo
          ? req.files.companyLogo[0].filename
          : null,
        applicationDate: req.body.applicationDate,
        deadline: req.body.deadline,
        reminderDays: req.body.reminderDays,
      });

      await job.save();

      res.status(201).json(job);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// =======================
// GET ALL JOBS (USER SPECIFIC)
// =======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =======================
// DELETE ALL USER JOBS
// =======================
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await Job.deleteMany({ userId: req.user.id });
    res.json({ message: "All your jobs deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// DELETE SINGLE JOB
// =======================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found or unauthorized" });
    }

    res.json({
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// =======================
// UPDATE JOB
// =======================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        company: req.body.company,
        role: req.body.role,
        status: req.body.status,
        jobSpec: req.body.jobSpec,
        oaStatus: req.body.oaStatus,
        interviewCall: req.body.interviewCall,
        applicationDate: req.body.applicationDate,
        deadline: req.body.deadline,
        reminderDays: req.body.reminderDays,
      },
      {
        returnDocument: 'after',
      }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found or unauthorized" });
    }

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;