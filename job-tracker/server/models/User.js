import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  profilePic: String,

  name: String,
  title: String,
  bio: String,

  university: String,
  degree: String,
  graduationYear: String,
  cgpa: String,

  skills: [String],

  linkedin: String,
  github: String,
  leetcode: String,
  codeforces: String,

  leetcodeRating: String,
  questionsSolved: String,
  codechefRating: String,
  codeforcesRating: String,

  applications: {
    type: Number,
    default: 0,
  },

  interviews: {
    type: Number,
    default: 0,
  },

  offers: {
    type: Number,
    default: 0,
  },

  successRate: {
    type: String,
    default: "0%",
  },
});

export default mongoose.model("User", userSchema);