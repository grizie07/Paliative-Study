import { ClipboardList, Download, FilePlus2, FileText, MessageSquarePlus, Users, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DEFAULT_TARGET = 369;

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [patients, setPatients] = useState([]);
  const [target, setTarget] = useState(() => {
    const saved = localStorage.getItem("patientTarget");
    return saved ? Number(saved) : DEFAULT_TARGET;
  });
  const [editingTarget, setEditingTarget] = useState(false);
  const [draftTarget, setDraftTarget] = useState(String(target));

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/patients");
        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch {
        setPatients([]);
      }
    };
    run();
  }, []);

  const completed = patients.length;
  const remaining = Math.max(target - completed, 0);
  const progress = target > 0 ? Math.min((completed / target) * 100, 100) : 0;

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const saveTarget = () => {
    const numeric = Number(draftTarget);
    if (!numeric || numeric < 1) return;
    setTarget(numeric);
    localStorage.setItem("patientTarget", String(numeric));
    setEditingTarget(false);
  };

  const progressText = useMemo(() => `${completed} / ${target}`, [completed, target]);

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || "Doctor"} · ${user?.role || "doctor"}`}
      />

      <div className="stats-grid">
        <StatCard label="Total Patients" value={completed} icon={<Users size={24} />} tone="blue" />
        <StatCard label="Baseline Assessments" value="—" icon={<ClipboardList size={24} />} tone="green" />
        <StatCard label="Follow-up Assessments" value="—" icon={<FileText size={24} />} tone="purple" />
        <StatCard label="Conference Records" value="—" icon={<MessageSquarePlus size={24} />} tone="orange" />
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Patient Recruitment Progress</h3>

          {!editingTarget ? (
            <button className="secondary-btn" onClick={() => {
              setDraftTarget(String(target));
              setEditingTarget(true);
            }}>
              Edit Target
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                value={draftTarget}
                onChange={(e) => setDraftTarget(e.target.value)}
                style={{ width: 100 }}
              />
              <button className="primary-btn" onClick={saveTarget}>Save</button>
              <button className="secondary-btn" onClick={() => setEditingTarget(false)}>Cancel</button>
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 24,
            alignItems: "center",
            marginTop: 16
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 160, height: 160 }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="52"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="52"
                  stroke="#2563eb"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 80 80)"
                />
              </svg>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 700 }}>{Math.round(progress)}%</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Completed</div>
              </div>
            </div>
          </div>

          <div className="detail-grid">
            <div><strong>Total Target:</strong> {target}</div>
            <div><strong>Completed Patients:</strong> {completed}</div>
            <div><strong>Remaining Patients:</strong> {remaining}</div>
            <div><strong>Progress:</strong> {progressText}</div>
          </div>
        </div>
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
    </div>
  );
}