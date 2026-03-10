import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import api from "../services/api";

export default function ConferenceCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [form, setForm] = useState({
    patientId: id,
    baselineAssessmentId: "",
    followupAssessmentId: "",
    conferenceDate: "",
    imagingModality: "",
    bodyRegion: "",
    imagingFindings: "",
    clinicalQuestionOrConcern: "",
    radiologyClarification: "",
    recommendations: "",
    treatmentPlanModified: false,
    goalsOfCareChanged: false,
    furtherImagingAdvised: false,
    symptomManagementChanged: false,
    additionalComments: "",
  });

  useEffect(() => {
    const run = async () => {
      const res = await api.get(`/assessments/patient/${id}`);
      setAssessments(res.data || []);
    };
    run();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/conference-records", {
      ...form,
      followupAssessmentId: form.followupAssessmentId || undefined,
    });
    navigate(`/patients/${id}`);
  };

  return (
    <div className="page">
      <PageHeader title="Conference Record" subtitle="Radiology conference impact entry" />

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Baseline Assessment</label>
            <select value={form.baselineAssessmentId} onChange={(e) => setForm((p) => ({ ...p, baselineAssessmentId: e.target.value }))}>
              <option value="">Select baseline</option>
              {assessments.filter((a) => a.assessmentType === "baseline").map((a) => (
                <option key={a._id} value={a._id}>{new Date(a.assessmentDate).toISOString().slice(0,10)}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Follow-up Assessment</label>
            <select value={form.followupAssessmentId} onChange={(e) => setForm((p) => ({ ...p, followupAssessmentId: e.target.value }))}>
              <option value="">Select follow-up</option>
              {assessments.filter((a) => a.assessmentType === "followup").map((a) => (
                <option key={a._id} value={a._id}>{new Date(a.assessmentDate).toISOString().slice(0,10)}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Conference Date</label>
            <input type="date" value={form.conferenceDate} onChange={(e) => setForm((p) => ({ ...p, conferenceDate: e.target.value }))} />
          </div>

          <div className="form-field">
            <label>Imaging Modality</label>
            <select value={form.imagingModality} onChange={(e) => setForm((p) => ({ ...p, imagingModality: e.target.value }))}>
              <option value="">Select</option>
              <option>X-RAY</option>
              <option>USG</option>
              <option>CT</option>
              <option>MRI</option>
              <option>PET-CT</option>
              <option>OTHER</option>
            </select>
          </div>

          <div className="form-field">
            <label>Body Region</label>
            <input value={form.bodyRegion} onChange={(e) => setForm((p) => ({ ...p, bodyRegion: e.target.value }))} />
          </div>

          <div className="form-field span-2">
            <label>Imaging Findings</label>
            <textarea rows="3" value={form.imagingFindings} onChange={(e) => setForm((p) => ({ ...p, imagingFindings: e.target.value }))} />
          </div>

          <div className="form-field span-2">
            <label>Clinical Question Or Concern</label>
            <textarea rows="3" value={form.clinicalQuestionOrConcern} onChange={(e) => setForm((p) => ({ ...p, clinicalQuestionOrConcern: e.target.value }))} />
          </div>

          <div className="form-field span-2">
            <label>Radiology Clarification</label>
            <textarea rows="3" value={form.radiologyClarification} onChange={(e) => setForm((p) => ({ ...p, radiologyClarification: e.target.value }))} />
          </div>

          <div className="form-field span-2">
            <label>Recommendations</label>
            <textarea rows="3" value={form.recommendations} onChange={(e) => setForm((p) => ({ ...p, recommendations: e.target.value }))} />
          </div>
        </div>

        <div className="checkbox-grid">
          <label className="checkbox-line"><input type="checkbox" checked={form.treatmentPlanModified} onChange={(e) => setForm((p) => ({ ...p, treatmentPlanModified: e.target.checked }))} />Treatment Plan Modified</label>
          <label className="checkbox-line"><input type="checkbox" checked={form.goalsOfCareChanged} onChange={(e) => setForm((p) => ({ ...p, goalsOfCareChanged: e.target.checked }))} />Goals Of Care Changed</label>
          <label className="checkbox-line"><input type="checkbox" checked={form.furtherImagingAdvised} onChange={(e) => setForm((p) => ({ ...p, furtherImagingAdvised: e.target.checked }))} />Further Imaging Advised</label>
          <label className="checkbox-line"><input type="checkbox" checked={form.symptomManagementChanged} onChange={(e) => setForm((p) => ({ ...p, symptomManagementChanged: e.target.checked }))} />Symptom Management Changed</label>
        </div>

        <div className="form-field">
          <label>Additional Comments</label>
          <textarea rows="4" value={form.additionalComments} onChange={(e) => setForm((p) => ({ ...p, additionalComments: e.target.value }))} />
        </div>

        <div className="footer-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate(`/patients/${id}`)}>Cancel</button>
          <button type="submit" className="primary-btn">Save Conference Record</button>
        </div>
      </form>
    </div>
  );
}