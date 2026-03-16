import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppShell from "./components/layout/AppShell";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/PatientsPage";
import PatientCreatePage from "./pages/PatientCreatePage";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import AssessmentCreatePage from "./pages/AssessmentCreatePage";
import ConferenceCreatePage from "./pages/ConferenceCreatePage";
import ExportPage from "./pages/ExportPage";

function ShellPage({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ShellPage><Dashboard /></ShellPage>} />
          <Route path="/dashboard" element={<ShellPage><Dashboard /></ShellPage>} />
          <Route path="/patients" element={<ShellPage><PatientsPage /></ShellPage>} />
          <Route path="/patients/new" element={<ShellPage><PatientCreatePage /></ShellPage>} />
          <Route path="/patients/:id" element={<ShellPage><PatientDetailsPage /></ShellPage>} />
          <Route path="/patients/:id/assessment/new" element={<ShellPage><AssessmentCreatePage /></ShellPage>} />
          <Route path="/patients/:id/conference/new" element={<ShellPage><ConferenceCreatePage /></ShellPage>} />
          <Route path="/assessments/:assessmentId/edit" element={<ShellPage><AssessmentCreatePage /></ShellPage>} />
          <Route path="/assessment/new" element={<ShellPage><AssessmentCreatePage /></ShellPage>} />
          <Route path="/export" element={<ShellPage><ExportPage /></ShellPage>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}