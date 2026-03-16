import { FlaskConical, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Invalid credentials. Please check your email and password."
      );
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
      <p className="login-subtitle">
        Palliative Care Quality-of-Life Research Platform
      </p>

      <div className="login-card">
        <h2>Researcher / Clinician Sign In</h2>
        <p className="card-subtext">Authorised personnel only</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="doctor@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <div className="password-wrap">
              <input
                type="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
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

      <p className="login-footer">
        © 2026 RAD-PAL-QOL Study. All rights reserved. For internal research use
        only.
      </p>
    </div>
  );
}