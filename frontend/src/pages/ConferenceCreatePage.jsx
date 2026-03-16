import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import api from "../services/api";

const emptyImagingRow = {
  modality: "",
  partRegion: "",
  yesNo: "",
  date: "",
  findings: ""
};

export default function ConferenceCreatePage() {
  const { id, conferenceId } = useParams();
  const navigate = useNavigate();

  const [baselineAssessments, setBaselineAssessments] = useState([]);
  const [followupAssessments, setFollowupAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    patientId: id || "",
    baselineAssessmentId: "",
    followupAssessmentId: "",
    conferenceDate: "",
    imagingRows: [{ ...emptyImagingRow }],
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
    additionalComments: ""
  });

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        const res = await api.get(`/assessments/patient/${id}`);
        const rows = Array.isArray(res.data) ? res.data : [];
        setBaselineAssessments(rows.filter((a) => a.assessmentType === "baseline"));
        setFollowupAssessments(rows.filter((a) => a.assessmentType === "followup"));
      } catch (err) {
        setSubmitError(err?.response?.data?.message || "Failed to load assessments.");
      }
    };

    if (id) {
      loadAssessments();
    }
  }, [id]);

  useEffect(() => {
    const loadConference = async () => {
      if (!conferenceId) return;

      setInitialLoading(true);
      setSubmitError("");

      try {
        const res = await api.get(`/conference-records/${conferenceId}`);
        const record = res.data;

        const derivedRows =
          Array.isArray(record.imagingRows) && record.imagingRows.length > 0
            ? record.imagingRows
            : [
                {
                  modality: record.imagingModality || "",
                  partRegion: record.bodyRegion || "",
                  yesNo: "",
                  date: record.conferenceDate
                    ? new Date(record.conferenceDate).toISOString().slice(0, 10)
                    : "",
                  findings: record.imagingFindings || ""
                }
              ];

        setForm({
          patientId: record.patientId?._id || record.patientId || id || "",
          baselineAssessmentId:
            record.baselineAssessmentId?._id || record.baselineAssessmentId || "",
          followupAssessmentId:
            record.followupAssessmentId?._id || record.followupAssessmentId || "",
          conferenceDate: record.conferenceDate
            ? new Date(record.conferenceDate).toISOString().slice(0, 10)
            : "",
          imagingRows: derivedRows.map((row) => ({
            modality: row.modality || "",
            partRegion: row.partRegion || "",
            yesNo: row.yesNo || "",
            date: row.date || "",
            findings: row.findings || ""
          })),
          imagingModality: record.imagingModality || "",
          bodyRegion: record.bodyRegion || "",
          imagingFindings: record.imagingFindings || "",
          clinicalQuestionOrConcern: record.clinicalQuestionOrConcern || "",
          radiologyClarification: record.radiologyClarification || "",
          recommendations: record.recommendations || "",
          treatmentPlanModified: !!record.treatmentPlanModified,
          goalsOfCareChanged: !!record.goalsOfCareChanged,
          furtherImagingAdvised: !!record.furtherImagingAdvised,
          symptomManagementChanged: !!record.symptomManagementChanged,
          additionalComments: record.additionalComments || ""
        });
      } catch (err) {
        setSubmitError(err?.response?.data?.message || "Failed to load conference record.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadConference();
  }, [conferenceId, id]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateImagingRow = (index, key, value) => {
    setForm((prev) => {
      const nextRows = [...prev.imagingRows];
      nextRows[index] = { ...nextRows[index], [key]: value };
      return { ...prev, imagingRows: nextRows };
    });
  };

  const addImagingRow = () => {
    setForm((prev) => ({
      ...prev,
      imagingRows: [...prev.imagingRows, { ...emptyImagingRow }]
    }));
  };

  const removeImagingRow = (index) => {
    setForm((prev) => {
      const nextRows = prev.imagingRows.filter((_, i) => i !== index);
      return {
        ...prev,
        imagingRows: nextRows.length ? nextRows : [{ ...emptyImagingRow }]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");

    try {
      const cleanedRows = form.imagingRows.filter(
        (row) => row.modality || row.partRegion || row.yesNo || row.date || row.findings
      );

      const firstRow = cleanedRows[0] || emptyImagingRow;

      const payload = {
        patientId: form.patientId,
        baselineAssessmentId: form.baselineAssessmentId,
        followupAssessmentId: form.followupAssessmentId || undefined,
        conferenceDate: form.conferenceDate,
        imagingRows: cleanedRows,
        imagingModality: firstRow.modality || "",
        bodyRegion: firstRow.partRegion || "",
        imagingFindings: firstRow.findings || "",
        clinicalQuestionOrConcern: form.clinicalQuestionOrConcern,
        radiologyClarification: form.radiologyClarification,
        recommendations: form.recommendations,
        treatmentPlanModified: form.treatmentPlanModified,
        goalsOfCareChanged: form.goalsOfCareChanged,
        furtherImagingAdvised: form.furtherImagingAdvised,
        symptomManagementChanged: form.symptomManagementChanged,
        additionalComments: form.additionalComments
      };

      if (conferenceId) {
        await api.patch(`/conference-records/${conferenceId}`, payload);
        navigate(`/patients/${form.patientId}`);
      } else {
        await api.post("/conference-records", payload);
        navigate(`/patients/${form.patientId}`);
      }
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Failed to save conference record."
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="page">Loading conference record...</div>;
  }

  return (
    <div className="page">
      <PageHeader
        title={conferenceId ? "Edit Conference Record" : "Conference Record"}
        subtitle="Radiology conference impact entry"
      />

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Baseline Assessment</label>
            <select
              value={form.baselineAssessmentId}
              onChange={(e) => updateField("baselineAssessmentId", e.target.value)}
            >
              <option value="">Select baseline</option>
              {baselineAssessments.map((a) => (
                <option key={a._id} value={a._id}>
                  {new Date(a.assessmentDate).toISOString().slice(0, 10)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Follow-up Assessment</label>
            <select
              value={form.followupAssessmentId}
              onChange={(e) => updateField("followupAssessmentId", e.target.value)}
            >
              <option value="">Select follow-up</option>
              {followupAssessments.map((a) => (
                <option key={a._id} value={a._id}>
                  {new Date(a.assessmentDate).toISOString().slice(0, 10)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Conference Date</label>
            <input
              type="date"
              value={form.conferenceDate}
              onChange={(e) => updateField("conferenceDate", e.target.value)}
            />
          </div>
        </div>

        <div className="panel" style={{ marginTop: 20 }}>
          <div className="panel-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Radiology Conference Discussion Rows</h3>
            <button type="button" className="secondary-btn" onClick={addImagingRow}>
              Add Imaging Row
            </button>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Modality</th>
                  <th>Part / Region</th>
                  <th>Yes / No</th>
                  <th>Date</th>
                  <th>Findings</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {form.imagingRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <select
                        value={row.modality}
                        onChange={(e) => updateImagingRow(idx, "modality", e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="X-RAY">X-RAY</option>
                        <option value="USG">USG</option>
                        <option value="CT">CT</option>
                        <option value="MRI">MRI</option>
                        <option value="PET-CT">PET-CT</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </td>
                    <td>
                      <input
                        value={row.partRegion}
                        onChange={(e) => updateImagingRow(idx, "partRegion", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={row.yesNo}
                        onChange={(e) => updateImagingRow(idx, "yesNo", e.target.value)}
                        placeholder="YES / NO"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => updateImagingRow(idx, "date", e.target.value)}
                      />
                    </td>
                    <td>
                      <textarea
                        rows="2"
                        value={row.findings}
                        onChange={(e) => updateImagingRow(idx, "findings", e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="tiny-btn"
                        onClick={() => removeImagingRow(idx)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 20 }}>
          <div className="form-field span-2">
            <label>Clinical Question Or Concern</label>
            <textarea rows="3" value={form.clinicalQuestionOrConcern} onChange={(e) => updateField("clinicalQuestionOrConcern", e.target.value)} />
          </div>

          <div className="form-field span-2">
            <label>Radiology Clarification</label>
            <textarea rows="3" value={form.radiologyClarification} onChange={(e) => updateField("radiologyClarification", e.target.value)} />
          </div>

          <div className="form-field span-2">
            <label>Recommendations</label>
            <textarea rows="3" value={form.recommendations} onChange={(e) => updateField("recommendations", e.target.value)} />
          </div>

          <div className="form-field">
            <label className="checkbox-line">
              <input type="checkbox" checked={form.treatmentPlanModified} onChange={(e) => updateField("treatmentPlanModified", e.target.checked)} />
              <span>Treatment Plan Modified</span>
            </label>
          </div>

          <div className="form-field">
            <label className="checkbox-line">
              <input type="checkbox" checked={form.goalsOfCareChanged} onChange={(e) => updateField("goalsOfCareChanged", e.target.checked)} />
              <span>Goals Of Care Changed</span>
            </label>
          </div>

          <div className="form-field">
            <label className="checkbox-line">
              <input type="checkbox" checked={form.furtherImagingAdvised} onChange={(e) => updateField("furtherImagingAdvised", e.target.checked)} />
              <span>Further Imaging Advised</span>
            </label>
          </div>

          <div className="form-field">
            <label className="checkbox-line">
              <input type="checkbox" checked={form.symptomManagementChanged} onChange={(e) => updateField("symptomManagementChanged", e.target.checked)} />
              <span>Symptom Management Changed</span>
            </label>
          </div>

          <div className="form-field span-2">
            <label>Additional Comments</label>
            <textarea rows="4" value={form.additionalComments} onChange={(e) => updateField("additionalComments", e.target.value)} />
          </div>
        </div>

        {submitError && <div className="error-box">{submitError}</div>}

        <div className="footer-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate(`/patients/${form.patientId}`)}>
            Cancel
          </button>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : conferenceId ? "Update Conference Record" : "Save Conference Record"}
          </button>
        </div>
      </form>
    </div>
  );
}