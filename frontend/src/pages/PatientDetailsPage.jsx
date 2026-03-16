import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import api from "../services/api";

function computeEsasTotal(esas = {}) {
  return [
    esas.pain,
    esas.tiredness,
    esas.drowsiness,
    esas.nausea,
    esas.appetite,
    esas.shortnessOfBreath,
    esas.depression,
    esas.anxiety,
    esas.wellbeing,
    esas.otherProblem
  ].reduce((sum, value) => sum + Number(value || 0), 0);
}

function computeQlqTotal(qlq = {}) {
  return Array.from({ length: 30 }, (_, i) => i + 1).reduce((sum, n) => {
    return sum + Number(qlq[`q${n}`] || 0);
  }, 0);
}

export default function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get(`/patients/${id}`);
        setData(res.data);
        setError("");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load patient details.");
      }
    };

    run();
  }, [id]);

  if (error) {
    return <div className="page"><div className="error-box">{error}</div></div>;
  }

  if (!data) return <div className="page">Loading...</div>;

  const { patient, assessments, conferenceRecords } = data;

  return (
    <div className="page">
      <PageHeader
        title="Patient Details"
        subtitle={`${patient.patientName} · ${patient.uhid}`}
        actions={
          <div className="page-actions">
            <button
              className="primary-btn"
              onClick={() => navigate(`/patients/${id}/assessment/new`)}
            >
              Add Assessment
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate(`/patients/${id}/conference/new`)}
            >
              Add Conference Record
            </button>
          </div>
        }
      />

      <div className="panel detail-card">
        <div className="detail-grid">
          <div><strong>UHID:</strong> {patient.uhid}</div>
          <div><strong>Name:</strong> {patient.patientName}</div>
          <div><strong>Age:</strong> {patient.age}</div>
          <div><strong>Gender:</strong> {patient.gender}</div>
          <div><strong>Diagnosis:</strong> {patient.primaryDiagnosis}</div>
          <div><strong>Stage:</strong> {patient.cancerStage}</div>
        </div>
      </div>

      <div className="panel">
        <h3>Assessments</h3>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>ESAS Total</th>
              <th>QLQ Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.length === 0 ? (
              <tr>
                <td colSpan="5">No assessments found.</td>
              </tr>
            ) : (
              assessments.map((a) => (
                <tr key={a._id}>
                  <td>{a.assessmentType}</td>
                  <td>{new Date(a.assessmentDate).toISOString().slice(0, 10)}</td>
                  <td>{computeEsasTotal(a.esas)}</td>
                  <td>{computeQlqTotal(a.qlqC30)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="tiny-btn"
                        onClick={() => navigate(`/assessments/${a._id}/edit`)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h3>Conference Records</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Imaging</th>
              <th>Body Region</th>
              <th>Treatment Modified</th>
              <th>Goals Changed</th>
            </tr>
          </thead>
          <tbody>
            {conferenceRecords.length === 0 ? (
              <tr>
                <td colSpan="5">No conference records found.</td>
              </tr>
            ) : (
              conferenceRecords.map((c) => (
                <tr key={c._id}>
                  <td>{new Date(c.conferenceDate).toISOString().slice(0, 10)}</td>
                  <td>{c.imagingModality}</td>
                  <td>{c.bodyRegion}</td>
                  <td>{String(c.treatmentPlanModified)}</td>
                  <td>{String(c.goalsOfCareChanged)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}