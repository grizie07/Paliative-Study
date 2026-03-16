import express from "express";
import { z } from "zod";
import ConferenceRecord from "../models/ConferenceRecord.js";
import Patient from "../models/Patient.js";
import Assessment from "../models/Assessment.js";
import { validate } from "../middleware/validate.js";
import { requireRole } from "../middleware/role.js";

function conferenceRoutes() {
  const router = express.Router();

  const imagingRowSchema = z.object({
    modality: z.string().optional(),
    partRegion: z.string().optional(),
    yesNo: z.string().optional(),
    date: z.string().optional(),
    findings: z.string().optional()
  });

  const createConferenceSchema = z.object({
    patientId: z.string().min(1),
    baselineAssessmentId: z.string().min(1),
    followupAssessmentId: z.string().optional(),
    conferenceDate: z.string(),

    imagingRows: z.array(imagingRowSchema).optional(),

    imagingModality: z.enum(["X-RAY", "USG", "CT", "MRI", "PET-CT", "OTHER", ""]).optional(),
    bodyRegion: z.string().optional(),
    imagingFindings: z.string().optional(),
    clinicalQuestionOrConcern: z.string().optional(),
    radiologyClarification: z.string().optional(),
    recommendations: z.string().optional(),

    treatmentPlanModified: z.boolean().optional(),
    goalsOfCareChanged: z.boolean().optional(),
    furtherImagingAdvised: z.boolean().optional(),
    symptomManagementChanged: z.boolean().optional(),

    additionalComments: z.string().optional()
  });

  const updateConferenceSchema = z.object({
    followupAssessmentId: z.string().optional(),
    conferenceDate: z.string().optional(),

    imagingRows: z.array(imagingRowSchema).optional(),

    imagingModality: z.enum(["X-RAY", "USG", "CT", "MRI", "PET-CT", "OTHER", ""]).optional(),
    bodyRegion: z.string().optional(),
    imagingFindings: z.string().optional(),
    clinicalQuestionOrConcern: z.string().optional(),
    radiologyClarification: z.string().optional(),
    recommendations: z.string().optional(),
    treatmentPlanModified: z.boolean().optional(),
    goalsOfCareChanged: z.boolean().optional(),
    furtherImagingAdvised: z.boolean().optional(),
    symptomManagementChanged: z.boolean().optional(),
    additionalComments: z.string().optional()
  });

  router.post(
    "/",
    requireRole("admin", "doctor"),
    validate(createConferenceSchema),
    async (req, res) => {
      try {
        const patient = await Patient.findById(req.body.patientId).lean();
        if (!patient) {
          return res.status(404).json({ message: "Patient not found" });
        }

        const baselineAssessment = await Assessment.findById(req.body.baselineAssessmentId).lean();
        if (!baselineAssessment) {
          return res.status(404).json({ message: "Baseline assessment not found" });
        }

        if (req.body.followupAssessmentId) {
          const followupAssessment = await Assessment.findById(req.body.followupAssessmentId).lean();
          if (!followupAssessment) {
            return res.status(404).json({ message: "Follow-up assessment not found" });
          }
        }

        const cleanedRows = Array.isArray(req.body.imagingRows)
          ? req.body.imagingRows.filter(
              (row) => row.modality || row.partRegion || row.yesNo || row.date || row.findings
            )
          : [];

        const firstRow = cleanedRows[0] || {};

        const conferenceRecord = await ConferenceRecord.create({
          patientId: req.body.patientId,
          baselineAssessmentId: req.body.baselineAssessmentId,
          followupAssessmentId: req.body.followupAssessmentId || null,
          conferenceDate: new Date(req.body.conferenceDate),

          imagingRows: cleanedRows,
          imagingModality: req.body.imagingModality || firstRow.modality || "",
          bodyRegion: req.body.bodyRegion || firstRow.partRegion || "",
          imagingFindings: req.body.imagingFindings || firstRow.findings || "",

          clinicalQuestionOrConcern: req.body.clinicalQuestionOrConcern || "",
          radiologyClarification: req.body.radiologyClarification || "",
          recommendations: req.body.recommendations || "",
          treatmentPlanModified: req.body.treatmentPlanModified || false,
          goalsOfCareChanged: req.body.goalsOfCareChanged || false,
          furtherImagingAdvised: req.body.furtherImagingAdvised || false,
          symptomManagementChanged: req.body.symptomManagementChanged || false,
          additionalComments: req.body.additionalComments || "",
          enteredBy: req.user.id
        });

        return res.status(201).json(conferenceRecord);
      } catch (error) {
        return res.status(500).json({
          message: "Failed to create conference record",
          error: error.message
        });
      }
    }
  );

  router.get(
    "/patient/:patientId",
    requireRole("admin", "doctor"),
    async (req, res) => {
      try {
        const records = await ConferenceRecord.find({ patientId: req.params.patientId })
          .populate("enteredBy", "name email role")
          .populate("baselineAssessmentId")
          .populate("followupAssessmentId")
          .sort({ conferenceDate: -1 })
          .lean();

        return res.json(records);
      } catch (error) {
        return res.status(500).json({
          message: "Failed to fetch conference records",
          error: error.message
        });
      }
    }
  );

  router.get(
    "/:id",
    requireRole("admin", "doctor"),
    async (req, res) => {
      try {
        const record = await ConferenceRecord.findById(req.params.id)
          .populate("patientId")
          .populate("enteredBy", "name email role")
          .populate("baselineAssessmentId")
          .populate("followupAssessmentId")
          .lean();

        if (!record) {
          return res.status(404).json({ message: "Conference record not found" });
        }

        return res.json(record);
      } catch (error) {
        return res.status(500).json({
          message: "Failed to fetch conference record",
          error: error.message
        });
      }
    }
  );

  router.patch(
    "/:id",
    requireRole("admin", "doctor"),
    validate(updateConferenceSchema),
    async (req, res) => {
      try {
        const existing = await ConferenceRecord.findById(req.params.id).lean();

        if (!existing) {
          return res.status(404).json({ message: "Conference record not found" });
        }

        const updateData = { ...req.body };

        if (updateData.conferenceDate) {
          updateData.conferenceDate = new Date(updateData.conferenceDate);
        }

        if (Array.isArray(updateData.imagingRows)) {
          updateData.imagingRows = updateData.imagingRows.filter(
            (row) => row.modality || row.partRegion || row.yesNo || row.date || row.findings
          );

          const firstRow = updateData.imagingRows[0] || {};
          updateData.imagingModality = updateData.imagingModality ?? firstRow.modality ?? "";
          updateData.bodyRegion = updateData.bodyRegion ?? firstRow.partRegion ?? "";
          updateData.imagingFindings = updateData.imagingFindings ?? firstRow.findings ?? "";
        }

        const updated = await ConferenceRecord.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
        ).lean();

        return res.json(updated);
      } catch (error) {
        return res.status(500).json({
          message: "Failed to update conference record",
          error: error.message
        });
      }
    }
  );

  return router;
}

export { conferenceRoutes };