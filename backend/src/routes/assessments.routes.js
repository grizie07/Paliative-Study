import express from "express";
import { z } from "zod";
import Assessment from "../models/Assessment.js";
import { requireRole } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const createAssessmentSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  assessmentType: z.enum(["baseline", "followup"]).optional(),
  assessmentDate: z.string().min(1, "Assessment date is required"),

  demographic: z.object({}).passthrough().optional(),
  history: z.object({}).passthrough().optional(),
  investigations: z.object({}).passthrough().optional(),
  preConference: z.object({}).passthrough().optional(),

  qlqC30: z.object({}).passthrough().optional(),
  esas: z.object({}).passthrough().optional(),

  radiologyConference: z.object({}).passthrough().optional(),
  postConferenceOutcomes: z.object({}).passthrough().optional(),
  postRadioConferenceAssessment: z.object({}).passthrough().optional(),
  summary: z.object({}).passthrough().optional(),

  notes: z.string().optional()
});

const updateAssessmentSchema = z.object({
  patientId: z.string().min(1).optional(),
  assessmentType: z.enum(["baseline", "followup"]).optional(),
  assessmentDate: z.string().min(1).optional(),

  demographic: z.object({}).passthrough().optional(),
  history: z.object({}).passthrough().optional(),
  investigations: z.object({}).passthrough().optional(),
  preConference: z.object({}).passthrough().optional(),

  qlqC30: z.object({}).passthrough().optional(),
  esas: z.object({}).passthrough().optional(),

  radiologyConference: z.object({}).passthrough().optional(),
  postConferenceOutcomes: z.object({}).passthrough().optional(),
  postRadioConferenceAssessment: z.object({}).passthrough().optional(),
  summary: z.object({}).passthrough().optional(),

  notes: z.string().optional()
});

router.post(
  "/",
  requireRole("admin", "doctor"),
  validate(createAssessmentSchema),
  async (req, res) => {
    try {
      const assessment = new Assessment({
        ...req.body,
        assessmentDate: new Date(req.body.assessmentDate)
      });

      await assessment.save();

      return res.status(201).json(assessment);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to create assessment",
        error: err.message
      });
    }
  }
);

router.get(
  "/patient/:patientId",
  requireRole("admin", "doctor"),
  async (req, res) => {
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
  }
);

router.get(
  "/:id",
  requireRole("admin", "doctor"),
  async (req, res) => {
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
  }
);

router.patch(
  "/:id",
  requireRole("admin", "doctor"),
  validate(updateAssessmentSchema),
  async (req, res) => {
    try {
      const updateData = { ...req.body };

      if (updateData.assessmentDate) {
        updateData.assessmentDate = new Date(updateData.assessmentDate);
      }

      const updated = await Assessment.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      return res.json(updated);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to update assessment",
        error: err.message
      });
    }
  }
);

export default router;