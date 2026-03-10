import express from "express";
import ExcelJS from "exceljs";
import Patient from "../models/Patient.js";
import Assessment from "../models/Assessment.js";

function exportRoutes(env) {
  const router = express.Router();

  router.get("/dataset", async (req, res) => {
    try {
      const patients = await Patient.find().lean();
      const assessments = await Assessment.find().lean();

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("RAD-PAL-QOL Dataset");

      sheet.columns = [
        { header: "Assessment ID", key: "assessmentId", width: 28 },
        { header: "Patient Mongo ID", key: "patientMongoId", width: 28 },
        { header: "UHID", key: "uhid", width: 20 },
        { header: "Patient Name", key: "patientName", width: 24 },
        { header: "Age", key: "age", width: 10 },
        { header: "Gender", key: "gender", width: 14 },
        { header: "Address", key: "address", width: 28 },
        { header: "Religion", key: "religion", width: 16 },
        { header: "Phone Number", key: "phoneNumber", width: 18 },
        { header: "Primary Diagnosis", key: "primaryDiagnosis", width: 30 },
        { header: "Diagnosis Date", key: "diagnosisDate", width: 18 },
        { header: "Cancer Stage", key: "cancerStage", width: 16 },
        { header: "Consent Given", key: "consentGiven", width: 14 },

        { header: "Assessment Type", key: "assessmentType", width: 16 },
        { header: "Assessment Date", key: "assessmentDate", width: 18 },
        { header: "Created At", key: "createdAt", width: 22 },
        { header: "Updated At", key: "updatedAt", width: 22 },

        { header: "Demographic Name", key: "demographicName", width: 24 },
        { header: "Demographic Age", key: "demographicAge", width: 14 },
        { header: "Demographic Gender", key: "demographicGender", width: 18 },
        { header: "Demographic Address", key: "demographicAddress", width: 30 },
        { header: "Demographic Religion", key: "demographicReligion", width: 18 },
        { header: "Demographic Date", key: "demographicDate", width: 18 },
        { header: "Demographic UHID", key: "demographicUhid", width: 18 },
        { header: "Informed Consent", key: "informedConsent", width: 18 },

        { header: "Oncological Diagnosis", key: "oncologicalDiagnosis", width: 30 },
        { header: "Chief Complaints", key: "chiefComplaints", width: 32 },
        { header: "Comorbidities", key: "comorbidities", width: 28 },
        { header: "Medical History", key: "medicalHistory", width: 28 },
        { header: "Surgical History", key: "surgicalHistory", width: 28 },
        { header: "General Examination", key: "generalExamination", width: 30 },
        { header: "ECOG PS", key: "ecogPs", width: 12 },
        { header: "Systemic Examination", key: "systemicExamination", width: 30 },
        { header: "Treatment Intent", key: "treatmentIntent", width: 18 },
        { header: "Best Supportive Care", key: "bestSupportiveCare", width: 20 },
        { header: "Documented By", key: "documentedBy", width: 20 },
        { header: "Documented On", key: "documentedOn", width: 18 },

        { header: "Investigation Date", key: "investigationDate", width: 18 },
        { header: "Haemoglobin", key: "haemoglobin", width: 14 },
        { header: "Total Leukocyte Count", key: "totalLeukocyteCount", width: 20 },
        { header: "Platelets", key: "platelets", width: 12 },
        { header: "Urea Creatinine", key: "ureaCreatinine", width: 18 },
        { header: "Sodium Potassium Calcium", key: "sodiumPotassiumCalcium", width: 24 },
        { header: "Total Bilirubin Direct Bilirubin", key: "totalBilirubinDirectBilirubin", width: 28 },
        { header: "SGOT SGPT ALP", key: "sgotSgptAlp", width: 18 },
        { header: "Total Protein Albumin", key: "totalProteinAlbumin", width: 22 },
        { header: "Investigation Others", key: "investigationOthers", width: 28 },
        { header: "Conservative Management", key: "conservativeManagement", width: 26 },
        { header: "Interventions Non Surgical", key: "interventionsNonSurgical", width: 26 },
        { header: "Interventions Surgical", key: "interventionsSurgical", width: 24 },
        { header: "Indication", key: "indication", width: 20 },
        { header: "Operation Notes", key: "operationNotes", width: 28 },
        { header: "Admission", key: "admission", width: 14 },
        { header: "Readmission", key: "readmission", width: 14 },
        { header: "Reason For Discussion Of Imaging", key: "reasonForDiscussionOfImaging", width: 32 },

        { header: "Pre Conference Goals Of Care", key: "preConferenceGoalsOfCare", width: 28 },

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

        { header: "QLQ Total Score", key: "qlqTotalScore", width: 16 },

        { header: "ESAS Pain", key: "esasPain", width: 12 },
        { header: "ESAS Tiredness", key: "esasTiredness", width: 14 },
        { header: "ESAS Drowsiness", key: "esasDrowsiness", width: 14 },
        { header: "ESAS Nausea", key: "esasNausea", width: 12 },
        { header: "ESAS Appetite", key: "esasAppetite", width: 12 },
        { header: "ESAS Shortness Of Breath", key: "esasShortnessOfBreath", width: 20 },
        { header: "ESAS Depression", key: "esasDepression", width: 14 },
        { header: "ESAS Anxiety", key: "esasAnxiety", width: 12 },
        { header: "ESAS Wellbeing", key: "esasWellbeing", width: 14 },
        { header: "ESAS Other Problem", key: "esasOtherProblem", width: 16 },
        { header: "ESAS Patient Name", key: "esasPatientName", width: 20 },
        { header: "ESAS Date", key: "esasDate", width: 16 },
        { header: "ESAS Time", key: "esasTime", width: 12 },
        { header: "ESAS Completed By Patient", key: "esasCompletedByPatient", width: 20 },
        { header: "ESAS Completed By Family Caregiver", key: "esasCompletedByFamilyCaregiver", width: 28 },
        { header: "ESAS Completed By Healthcare Professional Caregiver", key: "esasCompletedByHealthcareProfessionalCaregiver", width: 36 },
        { header: "Body Diagram Notes", key: "bodyDiagramNotes", width: 36 },
        { header: "ESAS Total Score", key: "esasTotalScore", width: 16 },

        { header: "Number Of Imaging Submitted", key: "numberOfImagingSubmitted", width: 22 },

        { header: "Conference Row1 Modality", key: "conf1Modality", width: 20 },
        { header: "Conference Row1 Part Region", key: "conf1PartRegion", width: 20 },
        { header: "Conference Row1 Yes No", key: "conf1YesNo", width: 16 },
        { header: "Conference Row1 Date", key: "conf1Date", width: 16 },
        { header: "Conference Row1 Findings", key: "conf1Findings", width: 28 },

        { header: "Conference Row2 Modality", key: "conf2Modality", width: 20 },
        { header: "Conference Row2 Part Region", key: "conf2PartRegion", width: 20 },
        { header: "Conference Row2 Yes No", key: "conf2YesNo", width: 16 },
        { header: "Conference Row2 Date", key: "conf2Date", width: 16 },
        { header: "Conference Row2 Findings", key: "conf2Findings", width: 28 },

        { header: "Conference Row3 Modality", key: "conf3Modality", width: 20 },
        { header: "Conference Row3 Part Region", key: "conf3PartRegion", width: 20 },
        { header: "Conference Row3 Yes No", key: "conf3YesNo", width: 16 },
        { header: "Conference Row3 Date", key: "conf3Date", width: 16 },
        { header: "Conference Row3 Findings", key: "conf3Findings", width: 28 },

        { header: "Conference Row4 Modality", key: "conf4Modality", width: 20 },
        { header: "Conference Row4 Part Region", key: "conf4PartRegion", width: 20 },
        { header: "Conference Row4 Yes No", key: "conf4YesNo", width: 16 },
        { header: "Conference Row4 Date", key: "conf4Date", width: 16 },
        { header: "Conference Row4 Findings", key: "conf4Findings", width: 28 },

        { header: "Conference Row5 Modality", key: "conf5Modality", width: 20 },
        { header: "Conference Row5 Part Region", key: "conf5PartRegion", width: 20 },
        { header: "Conference Row5 Yes No", key: "conf5YesNo", width: 16 },
        { header: "Conference Row5 Date", key: "conf5Date", width: 16 },
        { header: "Conference Row5 Findings", key: "conf5Findings", width: 28 },

        { header: "Conference Row6 Modality", key: "conf6Modality", width: 20 },
        { header: "Conference Row6 Part Region", key: "conf6PartRegion", width: 20 },
        { header: "Conference Row6 Yes No", key: "conf6YesNo", width: 16 },
        { header: "Conference Row6 Date", key: "conf6Date", width: 16 },
        { header: "Conference Row6 Findings", key: "conf6Findings", width: 28 },

        { header: "Summary Of Findings", key: "summaryOfFindings", width: 30 },
        { header: "Implications For Patient Care", key: "implicationsForPatientCare", width: 30 },
        { header: "Doubts Queries Put Forth", key: "doubtsQueriesPutForth", width: 28 },
        { header: "Artefacts New Findings Previously Missed", key: "artefactsNewFindingsPreviouslyMissed", width: 34 },
        { header: "New Queries Doubts Discussed", key: "newQueriesDoubtsDiscussed", width: 28 },
        { header: "Further Suggested Imaging Investigations", key: "furtherSuggestedImagingInvestigations", width: 34 },
        { header: "Further Suggestions For Management", key: "furtherSuggestionsForManagement", width: 30 },

        { header: "Changes In Primary Treatment", key: "changesInPrimaryTreatment", width: 28 },
        { header: "Changes In Intent Of Treatment", key: "changesInIntentOfTreatment", width: 28 },
        { header: "Assistance In Prognostication Survival Assessment", key: "assistanceInPrognosticationSurvivalAssessment", width: 36 },
        { header: "Psychosocial Or Spiritual Implications", key: "psychosocialOrSpiritualImplications", width: 32 },
        { header: "Goals Of Care Post DIRC", key: "goalsOfCarePostDIRC", width: 24 },
        { header: "Changes In Management Yes No", key: "changesInManagementYesNo", width: 24 },
        { header: "Changes In Management Describe", key: "changesInManagementDescribe", width: 28 },
        { header: "Further Imaging Advised Yes No", key: "furtherImagingAdvisedYesNo", width: 24 },
        { header: "Further Imaging Advised What", key: "furtherImagingAdvisedWhat", width: 26 },
        { header: "Goals Of Care Revised Yes No", key: "goalsOfCareRevisedYesNo", width: 24 },
        { header: "Advance Care Planning Discussions", key: "advanceCarePlanningDiscussions", width: 30 },

        { header: "Post Radio Conference QLQ Attached", key: "postQlqAttached", width: 24 },
        { header: "Post Radio Conference ESAS Attached", key: "postEsasAttached", width: 24 },

        { header: "Summary QLQ Overall Pre", key: "summaryQlqOverallPre", width: 22 },
        { header: "Summary QLQ Overall Post", key: "summaryQlqOverallPost", width: 22 },
        { header: "Summary ESAS Pre", key: "summaryEsasPre", width: 18 },
        { header: "Summary ESAS Post", key: "summaryEsasPost", width: 18 },
        { header: "Summary Active Symptoms Pre", key: "summaryActiveSymptomsPre", width: 24 },
        { header: "Summary Active Symptoms Post", key: "summaryActiveSymptomsPost", width: 24 },
        { header: "Summary Treatment Plan Modified Pre", key: "summaryTreatmentPlanModifiedPre", width: 28 },
        { header: "Summary Treatment Plan Modified Post", key: "summaryTreatmentPlanModifiedPost", width: 28 },
        { header: "Summary Goals Of Care Altered Pre", key: "summaryGoalsOfCareAlteredPre", width: 26 },
        { header: "Summary Goals Of Care Altered Post", key: "summaryGoalsOfCareAlteredPost", width: 26 },

        { header: "Notes", key: "notes", width: 24 }
      ];

      assessments.forEach((a) => {
        const patient = patients.find(
          (p) => p._id.toString() === String(a.patientId)
        );

        const rows = Array.isArray(a.radiologyConference?.rows)
          ? a.radiologyConference.rows
          : [];

        const r = (index) => rows[index] || {};

        const qlqTotal = Array.from({ length: 30 }, (_, i) => a.qlqC30?.[`q${i + 1}`] || 0)
          .reduce((sum, value) => sum + Number(value || 0), 0);

        const esasTotal =
          Number(a.esas?.pain || 0) +
          Number(a.esas?.tiredness || 0) +
          Number(a.esas?.drowsiness || 0) +
          Number(a.esas?.nausea || 0) +
          Number(a.esas?.appetite || 0) +
          Number(a.esas?.shortnessOfBreath || 0) +
          Number(a.esas?.depression || 0) +
          Number(a.esas?.anxiety || 0) +
          Number(a.esas?.wellbeing || 0);

        sheet.addRow({
          assessmentId: a._id?.toString() || "",
          patientMongoId: patient?._id?.toString() || "",
          uhid: patient?.uhid || "",
          patientName: patient?.patientName || "",
          age: patient?.age ?? "",
          gender: patient?.gender || "",
          address: patient?.address || "",
          religion: patient?.religion || "",
          phoneNumber: patient?.phoneNumber || "",
          primaryDiagnosis: patient?.primaryDiagnosis || "",
          diagnosisDate: patient?.diagnosisDate || "",
          cancerStage: patient?.cancerStage || "",
          consentGiven: patient?.consentGiven ?? "",

          assessmentType: a.assessmentType || "",
          assessmentDate: a.assessmentDate ? new Date(a.assessmentDate).toISOString().slice(0, 10) : "",
          createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : "",
          updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : "",

          demographicName: a.demographic?.name || "",
          demographicAge: a.demographic?.age || "",
          demographicGender: a.demographic?.gender || "",
          demographicAddress: a.demographic?.address || "",
          demographicReligion: a.demographic?.religion || "",
          demographicDate: a.demographic?.date || "",
          demographicUhid: a.demographic?.uhid || "",
          informedConsent: a.demographic?.informedConsent || "",

          oncologicalDiagnosis: a.history?.oncologicalDiagnosis || "",
          chiefComplaints: a.history?.chiefComplaints || "",
          comorbidities: a.history?.comorbidities || "",
          medicalHistory: a.history?.medicalHistory || "",
          surgicalHistory: a.history?.surgicalHistory || "",
          generalExamination: a.history?.generalExamination || "",
          ecogPs: a.history?.ecogPs || "",
          systemicExamination: a.history?.systemicExamination || "",
          treatmentIntent: a.history?.treatmentIntent || "",
          bestSupportiveCare: a.history?.bestSupportiveCare || "",
          documentedBy: a.history?.documentedBy || "",
          documentedOn: a.history?.documentedOn || "",

          investigationDate: a.investigations?.investigationDate || "",
          haemoglobin: a.investigations?.haemoglobin || "",
          totalLeukocyteCount: a.investigations?.totalLeukocyteCount || "",
          platelets: a.investigations?.platelets || "",
          ureaCreatinine: a.investigations?.ureaCreatinine || "",
          sodiumPotassiumCalcium: a.investigations?.sodiumPotassiumCalcium || "",
          totalBilirubinDirectBilirubin: a.investigations?.totalBilirubinDirectBilirubin || "",
          sgotSgptAlp: a.investigations?.sgotSgptAlp || "",
          totalProteinAlbumin: a.investigations?.totalProteinAlbumin || "",
          investigationOthers: a.investigations?.others || "",
          conservativeManagement: a.investigations?.conservativeManagement || "",
          interventionsNonSurgical: a.investigations?.interventionsNonSurgical || "",
          interventionsSurgical: a.investigations?.interventionsSurgical || "",
          indication: a.investigations?.indication || "",
          operationNotes: a.investigations?.operationNotes || "",
          admission: a.investigations?.admission || "",
          readmission: a.investigations?.readmission || "",
          reasonForDiscussionOfImaging: a.investigations?.reasonForDiscussionOfImaging || "",

          preConferenceGoalsOfCare: a.preConference?.goalsOfCare || "",

          q1: a.qlqC30?.q1 || "",
          q2: a.qlqC30?.q2 || "",
          q3: a.qlqC30?.q3 || "",
          q4: a.qlqC30?.q4 || "",
          q5: a.qlqC30?.q5 || "",
          q6: a.qlqC30?.q6 || "",
          q7: a.qlqC30?.q7 || "",
          q8: a.qlqC30?.q8 || "",
          q9: a.qlqC30?.q9 || "",
          q10: a.qlqC30?.q10 || "",
          q11: a.qlqC30?.q11 || "",
          q12: a.qlqC30?.q12 || "",
          q13: a.qlqC30?.q13 || "",
          q14: a.qlqC30?.q14 || "",
          q15: a.qlqC30?.q15 || "",
          q16: a.qlqC30?.q16 || "",
          q17: a.qlqC30?.q17 || "",
          q18: a.qlqC30?.q18 || "",
          q19: a.qlqC30?.q19 || "",
          q20: a.qlqC30?.q20 || "",
          q21: a.qlqC30?.q21 || "",
          q22: a.qlqC30?.q22 || "",
          q23: a.qlqC30?.q23 || "",
          q24: a.qlqC30?.q24 || "",
          q25: a.qlqC30?.q25 || "",
          q26: a.qlqC30?.q26 || "",
          q27: a.qlqC30?.q27 || "",
          q28: a.qlqC30?.q28 || "",
          q29: a.qlqC30?.q29 || "",
          q30: a.qlqC30?.q30 || "",
          qlqTotalScore: qlqTotal,

          esasPain: a.esas?.pain || 0,
          esasTiredness: a.esas?.tiredness || 0,
          esasDrowsiness: a.esas?.drowsiness || 0,
          esasNausea: a.esas?.nausea || 0,
          esasAppetite: a.esas?.appetite || 0,
          esasShortnessOfBreath: a.esas?.shortnessOfBreath || 0,
          esasDepression: a.esas?.depression || 0,
          esasAnxiety: a.esas?.anxiety || 0,
          esasWellbeing: a.esas?.wellbeing || 0,
          esasOtherProblem: a.esas?.otherProblem || 0,
          esasPatientName: a.esas?.patientName || "",
          esasDate: a.esas?.date || "",
          esasTime: a.esas?.time || "",
          esasCompletedByPatient: a.esas?.completedBy?.patient ?? false,
          esasCompletedByFamilyCaregiver: a.esas?.completedBy?.familyCaregiver ?? false,
          esasCompletedByHealthcareProfessionalCaregiver:
            a.esas?.completedBy?.healthcareProfessionalCaregiver ?? false,
          bodyDiagramNotes: a.esas?.bodyDiagramNotes || "",
          esasTotalScore: esasTotal,

          numberOfImagingSubmitted: a.radiologyConference?.numberOfImagingSubmitted || "",

          conf1Modality: r(0).modality || "",
          conf1PartRegion: r(0).partRegion || "",
          conf1YesNo: r(0).yesNo || "",
          conf1Date: r(0).date || "",
          conf1Findings: r(0).findings || "",

          conf2Modality: r(1).modality || "",
          conf2PartRegion: r(1).partRegion || "",
          conf2YesNo: r(1).yesNo || "",
          conf2Date: r(1).date || "",
          conf2Findings: r(1).findings || "",

          conf3Modality: r(2).modality || "",
          conf3PartRegion: r(2).partRegion || "",
          conf3YesNo: r(2).yesNo || "",
          conf3Date: r(2).date || "",
          conf3Findings: r(2).findings || "",

          conf4Modality: r(3).modality || "",
          conf4PartRegion: r(3).partRegion || "",
          conf4YesNo: r(3).yesNo || "",
          conf4Date: r(3).date || "",
          conf4Findings: r(3).findings || "",

          conf5Modality: r(4).modality || "",
          conf5PartRegion: r(4).partRegion || "",
          conf5YesNo: r(4).yesNo || "",
          conf5Date: r(4).date || "",
          conf5Findings: r(4).findings || "",

          conf6Modality: r(5).modality || "",
          conf6PartRegion: r(5).partRegion || "",
          conf6YesNo: r(5).yesNo || "",
          conf6Date: r(5).date || "",
          conf6Findings: r(5).findings || "",

          summaryOfFindings: a.radiologyConference?.summaryOfFindings || "",
          implicationsForPatientCare: a.radiologyConference?.implicationsForPatientCare || "",
          doubtsQueriesPutForth: a.radiologyConference?.doubtsQueriesPutForth || "",
          artefactsNewFindingsPreviouslyMissed:
            a.radiologyConference?.artefactsNewFindingsPreviouslyMissed || "",
          newQueriesDoubtsDiscussed: a.radiologyConference?.newQueriesDoubtsDiscussed || "",
          furtherSuggestedImagingInvestigations:
            a.radiologyConference?.furtherSuggestedImagingInvestigations || "",
          furtherSuggestionsForManagement:
            a.radiologyConference?.furtherSuggestionsForManagement || "",

          changesInPrimaryTreatment: a.postConferenceOutcomes?.changesInPrimaryTreatment || "",
          changesInIntentOfTreatment: a.postConferenceOutcomes?.changesInIntentOfTreatment || "",
          assistanceInPrognosticationSurvivalAssessment:
            a.postConferenceOutcomes?.assistanceInPrognosticationSurvivalAssessment || "",
          psychosocialOrSpiritualImplications:
            a.postConferenceOutcomes?.psychosocialOrSpiritualImplications || "",
          goalsOfCarePostDIRC: a.postConferenceOutcomes?.goalsOfCarePostDIRC || "",
          changesInManagementYesNo: a.postConferenceOutcomes?.changesInManagementYesNo || "",
          changesInManagementDescribe: a.postConferenceOutcomes?.changesInManagementDescribe || "",
          furtherImagingAdvisedYesNo: a.postConferenceOutcomes?.furtherImagingAdvisedYesNo || "",
          furtherImagingAdvisedWhat: a.postConferenceOutcomes?.furtherImagingAdvisedWhat || "",
          goalsOfCareRevisedYesNo: a.postConferenceOutcomes?.goalsOfCareRevisedYesNo || "",
          advanceCarePlanningDiscussions:
            a.postConferenceOutcomes?.advanceCarePlanningDiscussions || "",

          postQlqAttached: a.postRadioConferenceAssessment?.qlqAttached || "",
          postEsasAttached: a.postRadioConferenceAssessment?.esasAttached || "",

          summaryQlqOverallPre: a.summary?.eortcQlqC30OverallPre || "",
          summaryQlqOverallPost: a.summary?.eortcQlqC30OverallPost || "",
          summaryEsasPre: a.summary?.totalEsasScorePre || "",
          summaryEsasPost: a.summary?.totalEsasScorePost || "",
          summaryActiveSymptomsPre: a.summary?.activeSymptomsPre || "",
          summaryActiveSymptomsPost: a.summary?.activeSymptomsPost || "",
          summaryTreatmentPlanModifiedPre: a.summary?.treatmentPlanModifiedPre || "",
          summaryTreatmentPlanModifiedPost: a.summary?.treatmentPlanModifiedPost || "",
          summaryGoalsOfCareAlteredPre: a.summary?.goalsOfCareAlteredPre || "",
          summaryGoalsOfCareAlteredPost: a.summary?.goalsOfCareAlteredPost || "",

          notes: a.notes || ""
        });
      });

      sheet.getRow(1).font = { bold: true };
      sheet.views = [{ state: "frozen", ySplit: 1 }];

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="rad_pal_qol_dataset.xlsx"'
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to export dataset",
        error: error.message
      });
    }
  });

  return router;
}

export { exportRoutes };