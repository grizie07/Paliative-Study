import { FlaskConical, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-icon-box">
        <FlaskConical size={30} />
      </div>

      <h1 className="login-title">RAD-PAL-QOL Study System</h1>
      <p className="login-subtitle">Palliative Care Quality-of-Life Research Platform</p>

      <div className="login-card">
        <h2>Researcher / Clinician Sign In</h2>
        <p className="card-subtext">Authorised personnel only</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="doctor@radpalqol.org"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <div className="password-wrap">
              <input
                type="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              />
              <Eye size={18} className="eye-icon" />
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button className="primary-btn full-btn" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>

      <p className="login-footer">© 2024 RAD-PAL-QOL Study. All rights reserved. For internal research use only.</p>
    </div>
  );
}