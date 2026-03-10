import mongoose from "mongoose";

const ConferenceRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    baselineAssessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true
    },
    followupAssessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      default: null
    },
    conferenceDate: {
      type: Date,
      required: true
    },
    imagingModality: {
      type: String,
      default: ""
    },
    bodyRegion: {
      type: String,
      default: ""
    },
    imagingFindings: {
      type: String,
      default: ""
    },
    clinicalQuestionOrConcern: {
      type: String,
      default: ""
    },
    radiologyClarification: {
      type: String,
      default: ""
    },
    recommendations: {
      type: String,
      default: ""
    },
    treatmentPlanModified: {
      type: Boolean,
      default: false
    },
    goalsOfCareChanged: {
      type: Boolean,
      default: false
    },
    furtherImagingAdvised: {
      type: Boolean,
      default: false
    },
    symptomManagementChanged: {
      type: Boolean,
      default: false
    },
    additionalComments: {
      type: String,
      default: ""
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("ConferenceRecord", ConferenceRecordSchema);