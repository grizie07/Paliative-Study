import { Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import api from "../services/api";

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPatients = async (q = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/patients${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      setPatients(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const openPostDirc = async (patientId) => {
    try {
      const res = await api.get(`/assessments/patient/${patientId}`);
      const assessments = Array.isArray(res.data) ? res.data : [];

      if (!assessments.length) {
        alert("Create an assessment first before opening Post-DIRC.");
        return;
      }

      const baseline =
        assessments.find((a) => a.assessmentType === "baseline") || assessments[0];

      navigate(`/assessments/${baseline._id}/edit?step=6`);
    } catch {
      alert("Failed to open Post-DIRC.");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="page">
      <PageHeader
        title="Patients"
        subtitle="Browse and manage study participants"
        actions={
          <button className="primary-btn" onClick={() => navigate("/patients/new")}>
            <Plus size={18} />
            <span>Add Patient</span>
          </button>
        }
      />

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by UHID, patient name, or diagnosis"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button className="secondary-btn" onClick={() => fetchPatients(query)}>
          Search
        </button>
      </div>

      <div className="panel">
        {loading ? (
          <p>Loading patients...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>UHID</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Diagnosis</th>
                <th>Cancer Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7">No patients found.</td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p._id}>
                    <td>{p.uhid}</td>
                    <td>{p.patientName}</td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td>{p.primaryDiagnosis}</td>
                    <td>{p.cancerStage}</td>
                    <td>
                      <div className="table-actions">
                        <button className="tiny-btn" onClick={() => navigate(`/patients/${p._id}`)}>
                          View
                        </button>
                        <button className="tiny-btn" onClick={() => navigate(`/patients/${p._id}/assessment/new`)}>
                          Assessment
                        </button>
                        <button className="tiny-btn" onClick={() => openPostDirc(p._id)}>
                          Post-DIRC
                        </button>
                        <button className="tiny-btn" onClick={() => navigate(`/patients/${p._id}/conference/new`)}>
                          Conference
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}