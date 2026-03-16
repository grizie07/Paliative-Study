import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;

  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return false;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return decoded.exp > nowInSeconds;
}

function clearStoredAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (!token || !isTokenValid(token)) {
      clearStoredAuth();
      return null;
    }

    return { token, name, role, email };
  });

  const login = (data) => {
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("name", data.name);
    localStorage.setItem("role", data.role);
    localStorage.setItem("email", data.email);

    setUser({
      token: data.accessToken,
      name: data.name,
      role: data.role,
      email: data.email
    });
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}