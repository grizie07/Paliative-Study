import { ClipboardList, Download, FilePlus2, FileText, MessageSquarePlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/patients");
        setPatients(Array.isArray(res.data) ? res.data : []);
        setError("");
      } catch (err) {
        console.error("Failed to fetch patients:", err);
        setPatients([]);
        setError(err.response?.data?.message || "Failed to load patients");
      }
    };

    run();
  }, []);

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || "Doctor"} · ${user?.role || "doctor"}`}
      />

      {error ? (
        <div className="panel">
          <div className="panel-head">
            <h3>Load Error</h3>
          </div>
          <div className="status-box">
            <p>{error}</p>
          </div>
        </div>
      ) : null}

      <div className="stats-grid">
        <StatCard label="Total Patients" value={patients.length} icon={<Users size={24} />} tone="blue" />
        <StatCard label="Baseline Assessments" value="—" icon={<ClipboardList size={24} />} tone="green" />
        <StatCard label="Follow-up Assessments" value="—" icon={<FileText size={24} />} tone="purple" />
        <StatCard label="Conference Records" value="—" icon={<MessageSquarePlus size={24} />} tone="orange" />
      </div>

      <h3 className="section-label">QUICK ACTIONS</h3>
      <div className="action-row">
        <button className="primary-btn" onClick={() => navigate("/patients/new")}>
          <FilePlus2 size={18} />
          <span>Add Patient</span>
        </button>

        <button className="secondary-btn" onClick={() => navigate("/patients")}>
          <ClipboardList size={18} />
          <span>View Patients</span>
        </button>

        <button className="secondary-btn" onClick={() => navigate("/export")}>
          <Download size={18} />
          <span>Export Dataset</span>
        </button>
      </div>

      <div className="panel-grid">
        <div className="panel">
          <div className="panel-head">
            <h3>Recent Patients</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>UHID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.slice(0, 5).map((p) => (
                  <tr key={p._id}>
                    <td>{p.uhid}</td>
                    <td>{p.patientName}</td>
                    <td>{p.age}</td>
                    <td>{p.primaryDiagnosis}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No patients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>System Status</h3>
          </div>
          <div className="status-box">
            <p>Backend connected</p>
            <p>Authentication active</p>
            <p>Export ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}