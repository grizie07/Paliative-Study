import express from "express";
import Patient from "../models/Patient.js";
import Assessment from "../models/Assessment.js";
import ConferenceRecord from "../models/ConferenceRecord.js";
import { requireRole } from "../middleware/role.js";

function patientRoutes() {
  const router = express.Router();

  router.post("/", requireRole("admin", "doctor"), async (req, res) => {
    try {
      const existing = await Patient.findOne({ uhid: req.body.uhid }).lean();

      if (existing) {
        return res.status(409).json({
          message: "Patient with this UHID already exists"
        });
      }

      const patient = await Patient.create(req.body);
      return res.status(201).json(patient);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create patient",
        error: error.message
      });
    }
  });

  router.get("/", requireRole("admin", "doctor"), async (req, res) => {
    try {
      const q = (req.query.q || "").trim();

      let filter = {};
      if (q) {
        filter = {
          $or: [
            { uhid: { $regex: q, $options: "i" } },
            { patientName: { $regex: q, $options: "i" } },
            { primaryDiagnosis: { $regex: q, $options: "i" } }
          ]
        };
      }

      const patients = await Patient.find(filter).sort({ createdAt: -1 }).lean();
      return res.json(patients);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch patients",
        error: error.message
      });
    }
  });

  router.get("/:id", requireRole("admin", "doctor"), async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id).lean();

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const assessments = await Assessment.find({ patientId: req.params.id })
        .sort({ createdAt: -1 })
        .lean();

      const conferenceRecords = await ConferenceRecord.find({ patientId: req.params.id })
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        patient,
        assessments,
        conferenceRecords
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch patient details",
        error: error.message
      });
    }
  });

  router.patch("/:id", requireRole("admin", "doctor"), async (req, res) => {
    try {
      const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      }).lean();

      if (!updated) {
        return res.status(404).json({ message: "Patient not found" });
      }

      return res.json(updated);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to update patient",
        error: error.message
      });
    }
  });

  return router;
}

export { patientRoutes };