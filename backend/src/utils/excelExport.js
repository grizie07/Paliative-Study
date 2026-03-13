import ExcelJS from "exceljs";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

async function buildDatasetExcel(rows) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("RAD-PAL-QOL Dataset");

  sheet.columns = [
    { header: "Patient ID", key: "patientId", width: 28 },
    { header: "UHID", key: "uhid", width: 18 },
    { header: "Patient Name", key: "patientName", width: 24 },
    { header: "Age", key: "age", width: 10 },
    { header: "Gender", key: "gender", width: 12 },
    { header: "Address", key: "address", width: 24 },
    { header: "Religion", key: "religion", width: 16 },
    { header: "Phone Number", key: "phoneNumber", width: 16 },
    { header: "Primary Diagnosis", key: "primaryDiagnosis", width: 28 },
    { header: "Diagnosis Date", key: "diagnosisDate", width: 16 },
    { header: "Cancer Stage", key: "cancerStage", width: 14 },
    { header: "Consent Given", key: "consentGiven", width: 14 },

    { header: "Assessment ID", key: "assessmentId", width: 28 },
    { header: "Assessment Type", key: "assessmentType", width: 14 },
    { header: "Assessment Date", key: "assessmentDate", width: 16 },
    { header: "Assessment Notes", key: "assessmentNotes", width: 24 },

    { header: "ESAS Pain", key: "esasPain", width: 12 },
    { header: "ESAS Tiredness", key: "esasTiredness", width: 12 },
    { header: "ESAS Drowsiness", key: "esasDrowsiness", width: 12 },
    { header: "ESAS Nausea", key: "esasNausea", width: 12 },
    { header: "ESAS Appetite", key: "esasAppetite", width: 12 },
    { header: "ESAS Shortness Of Breath", key: "esasShortnessOfBreath", width: 18 },
    { header: "ESAS Depression", key: "esasDepression", width: 12 },
    { header: "ESAS Anxiety", key: "esasAnxiety", width: 12 },
    { header: "ESAS Wellbeing", key: "esasWellbeing", width: 12 },
    { header: "ESAS Other Problem", key: "esasOtherProblem", width: 14 },
    { header: "ESAS Total Score", key: "esasTotalScore", width: 14 },
    { header: "ESAS Severity", key: "esasSeverity", width: 12 },
    { header: "ESAS Active Symptom Count", key: "esasActiveSymptomCount", width: 18 },

    { header: "QLQ Q1", key: "q1", width: 10 },
    { header: "QLQ Q2", key: "q2", width: 10 },
    { header: "QLQ Q3", key: "q3", width: 10 },
    { header: "QLQ Q4", key: "q4", width: 10 },
    { header: "QLQ Q5", key: "q5", width: 10 },
    { header: "QLQ Q6", key: "q6", width: 10 },
    { header: "QLQ Q7", key: "q7", width: 10 },
    { header: "QLQ Q8", key: "q8", width: 10 },
    { header: "QLQ Q9", key: "q9", width: 10 },
    { header: "QLQ Q10", key: "q10", width: 10 },
    { header: "QLQ Q11", key: "q11", width: 10 },
    { header: "QLQ Q12", key: "q12", width: 10 },
    { header: "QLQ Q13", key: "q13", width: 10 },
    { header: "QLQ Q14", key: "q14", width: 10 },
    { header: "QLQ Q15", key: "q15", width: 10 },
    { header: "QLQ Q16", key: "q16", width: 10 },
    { header: "QLQ Q17", key: "q17", width: 10 },
    { header: "QLQ Q18", key: "q18", width: 10 },
    { header: "QLQ Q19", key: "q19", width: 10 },
    { header: "QLQ Q20", key: "q20", width: 10 },
    { header: "QLQ Q21", key: "q21", width: 10 },
    { header: "QLQ Q22", key: "q22", width: 10 },
    { header: "QLQ Q23", key: "q23", width: 10 },
    { header: "QLQ Q24", key: "q24", width: 10 },
    { header: "QLQ Q25", key: "q25", width: 10 },
    { header: "QLQ Q26", key: "q26", width: 10 },
    { header: "QLQ Q27", key: "q27", width: 10 },
    { header: "QLQ Q28", key: "q28", width: 10 },
    { header: "QLQ Q29", key: "q29", width: 10 },
    { header: "QLQ Q30", key: "q30", width: 10 },
    { header: "QLQ Total Score", key: "qlqTotalScore", width: 14 },

    { header: "Conference ID", key: "conferenceId", width: 28 },
    { header: "Conference Date", key: "conferenceDate", width: 16 },
    { header: "Imaging Modality", key: "imagingModality", width: 16 },
    { header: "Body Region", key: "bodyRegion", width: 18 },
    { header: "Imaging Findings", key: "imagingFindings", width: 30 },
    { header: "Clinical Question Or Concern", key: "clinicalQuestionOrConcern", width: 32 },
    { header: "Radiology Clarification", key: "radiologyClarification", width: 30 },
    { header: "Recommendations", key: "recommendations", width: 30 },
    { header: "Treatment Plan Modified", key: "treatmentPlanModified", width: 18 },
    { header: "Goals Of Care Changed", key: "goalsOfCareChanged", width: 18 },
    { header: "Further Imaging Advised", key: "furtherImagingAdvised", width: 18 },
    { header: "Symptom Management Changed", key: "symptomManagementChanged", width: 20 },
    { header: "Additional Comments", key: "additionalComments", width: 30 }
  ];

  rows.forEach((row) => sheet.addRow(row));

  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  return workbook;
}

export { buildDatasetExcel, formatDate };