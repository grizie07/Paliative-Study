import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import api from "../services/api";

export default function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const run = async () => {
      const res = await api.get(`/patients/${id}`);
      setData(res.data);
    };
    run();
  }, [id]);

  if (!data) return <div className="page">Loading...</div>;

  const { patient, assessments, conferenceRecords } = data;

  return (
    <div className="page">
      <PageHeader
        title="Patient Details"
        subtitle={`${patient.patientName} · ${patient.uhid}`}
        actions={
          <div className="page-actions">
            <button className="primary-btn" onClick={() => navigate(`/patients/${id}/assessment/new`)}>
              Add Assessment
            </button>
            <button className="secondary-btn" onClick={() => navigate(`/patients/${id}/conference/new`)}>
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
              <th>Severity</th>
              <th>QLQ Total</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a) => (
              <tr key={a._id}>
                <td>{a.assessmentType}</td>
                <td>{new Date(a.assessmentDate).toISOString().slice(0, 10)}</td>
                <td>{a.esas?.totalScore}</td>
                <td>{a.esas?.severity}</td>
                <td>{a.qlqC30?.totalScore}</td>
              </tr>
            ))}
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
            {conferenceRecords.map((c) => (
              <tr key={c._id}>
                <td>{new Date(c.conferenceDate).toISOString().slice(0, 10)}</td>
                <td>{c.imagingModality}</td>
                <td>{c.bodyRegion}</td>
                <td>{String(c.treatmentPlanModified)}</td>
                <td>{String(c.goalsOfCareChanged)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}