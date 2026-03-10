import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Download, LogOut, FlaskConical } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-icon">
            <FlaskConical size={22} />
          </div>
          <div>
            <div className="brand-title">RAD-PAL-QOL</div>
            <div className="brand-subtitle">Study System</div>
          </div>
        </div>

        <nav className="nav-list">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/patients" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Users size={18} />
            <span>Patients</span>
          </NavLink>

          <NavLink to="/export" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Download size={18} />
            <span>Export Dataset</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="user-box">
          <div className="avatar">{(user?.name || "U").slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-role">{user?.role || "doctor"}</div>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}