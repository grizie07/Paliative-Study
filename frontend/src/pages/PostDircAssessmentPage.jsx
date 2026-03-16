import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import api from "../services/api";

const qlqEn = [
  "Do you have any trouble doing strenuous activities, like carrying a heavy shopping bag or a suitcase?",
  "Do you have any trouble taking a long walk?",
  "Do you have any trouble taking a short walk outside of the house?",
  "Do you need to stay in bed or a chair during the day?",
  "Do you need help with eating, dressing, washing yourself or using the toilet?",
  "Were you limited in doing either your work or other daily activities?",
  "Were you limited in pursuing your hobbies or other leisure time activities?",
  "Were you short of breath?",
  "Have you had pain?",
  "Did you need to rest?",
  "Have you had trouble sleeping?",
  "Have you felt weak?",
  "Have you lacked appetite?",
  "Have you felt nauseated?",
  "Have you vomited?",
  "Have you been constipated?",
  "Have you had diarrhea?",
  "Were you tired?",
  "Did pain interfere with your daily activities?",
  "Have you had difficulty in concentrating on things, like reading a newspaper or watching television?",
  "Did you feel tense?",
  "Did you worry?",
  "Did you feel irritable?",
  "Did you feel depressed?",
  "Have you had difficulty remembering things?",
  "Has your physical condition or medical treatment interfered with your family life?",
  "Has your physical condition or medical treatment interfered with your social activities?",
  "Has your physical condition or medical treatment caused you financial difficulties?",
  "How would you rate your overall health during the past week?",
  "How would you rate your overall quality of life during the past week?"
];

const esasFields = [
  { key: "pain", label: "Pain" },
  { key: "tiredness", label: "Tiredness" },
  { key: "drowsiness", label: "Drowsiness" },
  { key: "nausea", label: "Nausea" },
  { key: "appetite", label: "Lack of Appetite" },
  { key: "shortnessOfBreath", label: "Shortness of Breath" },
  { key: "depression", label: "Depression" },
  { key: "anxiety", label: "Anxiety / Ghabrahat" },
  { key: "wellbeing", label: "Wellbeing" },
  { key: "otherProblem", label: "Other Problem" }
];

const defaultForm = {
  language: "en",
  postDircQlqC30: Object.fromEntries(
    Array.from({ length: 30 }, (_, i) => [`q${i + 1}`, 1])
  ),
  postDircEsas: {
    pain: 0,
    tiredness: 0,
    drowsiness: 0,
    nausea: 0,
    appetite: 0,
    shortnessOfBreath: 0,
    depression: 0,
    anxiety: 0,
    wellbeing: 0,
    otherProblem: 0,
    patientName: "",
    date: "",
    time: "",
    completedBy: {
      patient: false,
      familyCaregiver: false,
      healthcareProfessionalCaregiver: false
    },
    bodyDiagramNotes: ""
  },
  postConferenceOutcomes: {
    changesInPrimaryTreatment: "",
    changesInIntentOfTreatment: "",
    assistanceInPrognosticationSurvivalAssessment: "",
    psychosocialOrSpiritualImplications: "",
    goalsOfCarePostDIRC: "",
    changesInManagementYesNo: "",
    changesInManagementDescribe: "",
    furtherImagingAdvisedYesNo: "",
    furtherImagingAdvisedWhat: "",
    goalsOfCareRevisedYesNo: "",
    advanceCarePlanningDiscussions: ""
  },
  summary: {
    eortcQlqC30OverallPre: "",
    eortcQlqC30OverallPost: "",
    totalEsasScorePre: "",
    totalEsasScorePost: "",
    activeSymptomsPre: "",
    activeSymptomsPost: "",
    treatmentPlanModifiedPre: "",
    treatmentPlanModifiedPost: "",
    goalsOfCareAlteredPre: "",
    goalsOfCareAlteredPost: ""
  }
};

export default function PostDircAssessmentPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [patientId, setPatientId] = useState("");
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get(`/assessments/${assessmentId}`);
        const a = res.data;
        setPatientId(a.patientId?._id || a.patientId || "");
        setForm((prev) => ({
          ...prev,
          postDircQlqC30: { ...prev.postDircQlqC30, ...(a.postDircQlqC30 || {}) },
          postDircEsas: {
            ...prev.postDircEsas,
            ...(a.postDircEsas || {}),
            completedBy: {
              ...prev.postDircEsas.completedBy,
              ...(a.postDircEsas?.completedBy || {})
            }
          },
          postConferenceOutcomes: {
            ...prev.postConferenceOutcomes,
            ...(a.postConferenceOutcomes || {})
          },
          summary: { ...prev.summary, ...(a.summary || {}) }
        }));
      } catch (err) {
        setSubmitError(err?.response?.data?.message || "Failed to load Post-DIRC.");
      } finally {
        setInitialLoading(false);
      }
    };

    run();
  }, [assessmentId]);

  const postDircEsasTotal = useMemo(() => {
    return [
      form.postDircEsas.pain,
      form.postDircEsas.tiredness,
      form.postDircEsas.drowsiness,
      form.postDircEsas.nausea,
      form.postDircEsas.appetite,
      form.postDircEsas.shortnessOfBreath,
      form.postDircEsas.depression,
      form.postDircEsas.anxiety,
      form.postDircEsas.wellbeing
    ].reduce((a, b) => a + Number(b || 0), 0);
  }, [form.postDircEsas]);

  const postDircActiveSymptoms = useMemo(() => {
    return [
      form.postDircEsas.pain,
      form.postDircEsas.tiredness,
      form.postDircEsas.drowsiness,
      form.postDircEsas.nausea,
      form.postDircEsas.appetite,
      form.postDircEsas.shortnessOfBreath,
      form.postDircEsas.depression,
      form.postDircEsas.anxiety,
      form.postDircEsas.wellbeing
    ].filter((v) => Number(v) > 0).length;
  }, [form.postDircEsas]);

  const updateNested = (group, key, value) => {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value
      }
    }));
  };

  const savePostDirc = async () => {
    setLoading(true);
    setSubmitError("");

    try {
      await api.patch(`/assessments/${assessmentId}`, {
        postDircQlqC30: form.postDircQlqC30,
        postDircEsas: form.postDircEsas,
        postConferenceOutcomes: form.postConferenceOutcomes,
        summary: form.summary
      });

      navigate(`/patients/${patientId}`);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "Failed to save Post-DIRC.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="page">Loading Post-DIRC...</div>;
  }

  return (
    <div className="page">
      <PageHeader title="Post-DIRC" subtitle={`Assessment: ${assessmentId}`} />

      <div className="panel form-panel">
        <h3>POST-DIRC QLQ-C30</h3>
        <div className="question-grid">
          {qlqEn.map((text, i) => {
            const qNo = i + 1;
            const options =
              qNo >= 29
                ? ["Very poor", "Poor", "Fair", "Good", "Very good", "Excellent", "Excellent"]
                : ["Not at all", "A little", "Quite a bit", "Very much"];

            return (
              <div key={qNo} className="question-card">
                <label>{qNo}. {text}</label>
                <select
                  value={form.postDircQlqC30[`q${qNo}`]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      postDircQlqC30: {
                        ...prev.postDircQlqC30,
                        [`q${qNo}`]: Number(e.target.value)
                      }
                    }))
                  }
                >
                  {options.map((opt, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {idx + 1} - {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        <h3 style={{ marginTop: 24 }}>POST-DIRC ESAS-r</h3>
        <div className="question-grid">
          {esasFields.map((field) => (
            <div key={field.key} className="question-card">
              <label>{field.label}</label>
              <select
                value={form.postDircEsas[field.key]}
                onChange={(e) => updateNested("postDircEsas", field.key, Number(e.target.value))}
              >
                {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="esas-summary-grid">
          <div className="summary-box">
            <div className="summary-title">Post-DIRC Total ESAS Score</div>
            <div className="summary-value">{postDircEsasTotal}</div>
          </div>
          <div className="summary-box">
            <div className="summary-title">Post-DIRC Active Symptoms</div>
            <div className="summary-value">{postDircActiveSymptoms}</div>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 18 }}>
          <div className="form-field"><label>Patient Name</label><input value={form.postDircEsas.patientName} onChange={(e) => updateNested("postDircEsas", "patientName", e.target.value)} /></div>
          <div className="form-field"><label>Date</label><input type="date" value={form.postDircEsas.date} onChange={(e) => updateNested("postDircEsas", "date", e.target.value)} /></div>
          <div className="form-field"><label>Time</label><input value={form.postDircEsas.time} onChange={(e) => updateNested("postDircEsas", "time", e.target.value)} /></div>
        </div>

        <div className="checkbox-grid">
          <label className="checkbox-line"><input type="checkbox" checked={form.postDircEsas.completedBy.patient} onChange={(e) => setForm((prev) => ({ ...prev, postDircEsas: { ...prev.postDircEsas, completedBy: { ...prev.postDircEsas.completedBy, patient: e.target.checked } } }))} />Patient</label>
          <label className="checkbox-line"><input type="checkbox" checked={form.postDircEsas.completedBy.familyCaregiver} onChange={(e) => setForm((prev) => ({ ...prev, postDircEsas: { ...prev.postDircEsas, completedBy: { ...prev.postDircEsas.completedBy, familyCaregiver: e.target.checked } } }))} />Family Caregiver</label>
          <label className="checkbox-line"><input type="checkbox" checked={form.postDircEsas.completedBy.healthcareProfessionalCaregiver} onChange={(e) => setForm((prev) => ({ ...prev, postDircEsas: { ...prev.postDircEsas, completedBy: { ...prev.postDircEsas.completedBy, healthcareProfessionalCaregiver: e.target.checked } } }))} />Health Care Professional Caregiver</label>
        </div>

        <div className="body-map-grid" style={{ marginTop: 18 }}>
          <div className="body-map-card">
            <h4>Body Map</h4>
            <img src="/body-map.png" alt="Body map" className="body-map-image" />
          </div>
          <div className="body-map-card">
            <h4>Body Diagram Notes</h4>
            <textarea
              rows="10"
              value={form.postDircEsas.bodyDiagramNotes}
              onChange={(e) => updateNested("postDircEsas", "bodyDiagramNotes", e.target.value)}
            />
          </div>
        </div>

        <h3 style={{ marginTop: 24 }}>Post Conference Outcomes</h3>
        <div className="form-grid">
          <div className="form-field span-2"><label>Changes in primary treatment</label><textarea rows="3" value={form.postConferenceOutcomes.changesInPrimaryTreatment} onChange={(e) => updateNested("postConferenceOutcomes", "changesInPrimaryTreatment", e.target.value)} /></div>
          <div className="form-field span-2"><label>Changes in intent of treatment</label><textarea rows="3" value={form.postConferenceOutcomes.changesInIntentOfTreatment} onChange={(e) => updateNested("postConferenceOutcomes", "changesInIntentOfTreatment", e.target.value)} /></div>
          <div className="form-field span-2"><label>Goals of care post DIRC</label><textarea rows="3" value={form.postConferenceOutcomes.goalsOfCarePostDIRC} onChange={(e) => updateNested("postConferenceOutcomes", "goalsOfCarePostDIRC", e.target.value)} /></div>
        </div>

        <h3 style={{ marginTop: 24 }}>Summary</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Pre-DIRC</th>
                <th>Post-DIRC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>EORTC QLQ C30 overall score</td>
                <td><input value={form.summary.eortcQlqC30OverallPre} onChange={(e) => updateNested("summary", "eortcQlqC30OverallPre", e.target.value)} /></td>
                <td><input value={form.summary.eortcQlqC30OverallPost} onChange={(e) => updateNested("summary", "eortcQlqC30OverallPost", e.target.value)} /></td>
              </tr>
              <tr>
                <td>Total ESAS Score</td>
                <td><input value={form.summary.totalEsasScorePre} onChange={(e) => updateNested("summary", "totalEsasScorePre", e.target.value)} /></td>
                <td><input value={form.summary.totalEsasScorePost} onChange={(e) => updateNested("summary", "totalEsasScorePost", e.target.value)} /></td>
              </tr>
              <tr>
                <td>Number of active symptoms</td>
                <td><input value={form.summary.activeSymptomsPre} onChange={(e) => updateNested("summary", "activeSymptomsPre", e.target.value)} /></td>
                <td><input value={form.summary.activeSymptomsPost} onChange={(e) => updateNested("summary", "activeSymptomsPost", e.target.value)} /></td>
              </tr>
              <tr>
                <td>Treatment plan modified (Yes/No)</td>
                <td><input value={form.summary.treatmentPlanModifiedPre} onChange={(e) => updateNested("summary", "treatmentPlanModifiedPre", e.target.value)} /></td>
                <td><input value={form.summary.treatmentPlanModifiedPost} onChange={(e) => updateNested("summary", "treatmentPlanModifiedPost", e.target.value)} /></td>
              </tr>
              <tr>
                <td>Goals of care altered (Yes/No)</td>
                <td><input value={form.summary.goalsOfCareAlteredPre} onChange={(e) => updateNested("summary", "goalsOfCareAlteredPre", e.target.value)} /></td>
                <td><input value={form.summary.goalsOfCareAlteredPost} onChange={(e) => updateNested("summary", "goalsOfCareAlteredPost", e.target.value)} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {submitError && <div className="error-box">{submitError}</div>}

        <div className="footer-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate(`/patients/${patientId}`)}>
            Cancel
          </button>
          <button type="button" className="primary-btn" onClick={savePostDirc} disabled={loading}>
            {loading ? "Saving..." : "Save Post-DIRC"}
          </button>
        </div>
      </div>
    </div>
  );
}