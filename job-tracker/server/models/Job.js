import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: String,
    role: String,
    status: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Resume
    resume: {
      type: String,
      default: null,
    },

    // Company Logo
    companyLogo: {
      type: String,
      default: null,
    },

    // Additional Fields
    jobSpec: String,
    oaStatus: String,
    interviewCall: String,


applicationDate: String,
deadline: String,
reminderDays: String,

finalStatus: {
  type: String,
  default: "Pending",
},
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);