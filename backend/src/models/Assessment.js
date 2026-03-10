import mongoose from "mongoose";

const qlqFields = {};
for (let i = 1; i <= 30; i++) {
  qlqFields[`q${i}`] = {
    type: Number,
    min: 1,
    max: i >= 29 ? 7 : 4,
    default: 1
  };
}

const qlqC30Schema = new mongoose.Schema(qlqFields, { _id: false });

const esasSchema = new mongoose.Schema(
  {
    pain: { type: Number, default: 0 },
    tiredness: { type: Number, default: 0 },
    drowsiness: { type: Number, default: 0 },
    nausea: { type: Number, default: 0 },
    appetite: { type: Number, default: 0 },
    shortnessOfBreath: { type: Number, default: 0 },
    depression: { type: Number, default: 0 },
    anxiety: { type: Number, default: 0 },
    wellbeing: { type: Number, default: 0 },
    otherProblem: { type: Number, default: 0 },

    patientName: { type: String, default: "" },
    date: { type: String, default: "" },
    time: { type: String, default: "" },

    completedBy: {
      patient: { type: Boolean, default: false },
      familyCaregiver: { type: Boolean, default: false },
      healthcareProfessionalCaregiver: { type: Boolean, default: false }
    },

    bodyDiagramNotes: { type: String, default: "" }
  },
  { _id: false }
);

const AssessmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    assessmentType: {
      type: String,
      enum: ["baseline", "followup"],
      default: "baseline"
    },

    assessmentDate: {
      type: Date,
      required: true
    },

    demographic: { type: Object, default: {} },
    history: { type: Object, default: {} },
    investigations: { type: Object, default: {} },
    preConference: { type: Object, default: {} },

    qlqC30: {
      type: qlqC30Schema,
      default: () => ({})
    },

    esas: {
      type: esasSchema,
      default: () => ({})
    },

    radiologyConference: { type: Object, default: {} },
    postConferenceOutcomes: { type: Object, default: {} },
    postRadioConferenceAssessment: { type: Object, default: {} },
    summary: { type: Object, default: {} },

    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", AssessmentSchema);