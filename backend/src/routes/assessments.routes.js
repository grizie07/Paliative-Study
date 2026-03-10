import express from "express";
import Assessment from "../models/Assessment.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    await assessment.save();

    return res.status(201).json(assessment);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create assessment",
      error: err.message
    });
  }
});

router.get("/patient/:patientId", async (req, res) => {
  try {
    const assessments = await Assessment.find({
      patientId: req.params.patientId
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(assessments);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch assessments",
      error: err.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate("patientId")
      .lean();

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    return res.json(assessment);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch assessment",
      error: err.message
    });
  }
});

export default router;