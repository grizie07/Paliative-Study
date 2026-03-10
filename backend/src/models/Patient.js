import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    uhid: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    religion: {
      type: String,
      default: ""
    },
    phoneNumber: {
      type: String,
      default: ""
    },
    primaryDiagnosis: {
      type: String,
      default: ""
    },
    diagnosisDate: {
      type: String,
      default: ""
    },
    cancerStage: {
      type: String,
      default: ""
    },
    consentGiven: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);