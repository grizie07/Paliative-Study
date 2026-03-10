import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import api from "../services/api";
import { useState } from "react";

export default function PatientCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    uhid: "",
    patientName: "",
    age: "",
    gender: "",
    address: "",
    religion: "",
    phoneNumber: "",
    primaryDiagnosis: "",
    diagnosisDate: "",
    cancerStage: "",
    consentGiven: false,
  });

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      age: form.age ? Number(form.age) : undefined,
    };
    const res = await api.post("/patients", payload);
    navigate(`/patients/${res.data._id}`);
  };

  return (
    <div className="page">
      <PageHeader title="Create Patient" subtitle="Add a new study participant record" />

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Details</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>UHID</label>
              <input value={form.uhid} onChange={(e) => update("uhid", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Patient Name</label>
              <input value={form.patientName} onChange={(e) => update("patientName", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Age</label>
              <input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Gender</label>
              <select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Demographics / Contact</h3>
          <div className="form-grid">
            <div className="form-field span-2">
              <label>Address</label>
              <input value={form.address} onChange={(e) => update("address", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Religion</label>
              <input value={form.religion} onChange={(e) => update("religion", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <input value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Diagnosis Details</h3>
          <div className="form-grid">
            <div className="form-field span-2">
              <label>Primary Diagnosis</label>
              <input value={form.primaryDiagnosis} onChange={(e) => update("primaryDiagnosis", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Diagnosis Date</label>
              <input type="date" value={form.diagnosisDate} onChange={(e) => update("diagnosisDate", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Cancer Stage</label>
              <input value={form.cancerStage} onChange={(e) => update("cancerStage", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Consent</h3>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={form.consentGiven}
              onChange={(e) => update("consentGiven", e.target.checked)}
            />
            <span>Consent Given</span>
          </label>
        </div>

        <div className="footer-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate("/patients")}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Save Patient
          </button>
        </div>
      </form>
    </div>
  );
}