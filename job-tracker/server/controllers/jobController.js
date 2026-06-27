import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.json(job);
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

export const updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
  res.json(job);
};

export const deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json("Deleted");
};