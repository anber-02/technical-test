import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import { useAuthStore } from "../lib/store/auth";

export function PublicRoutes() {
  return (
    <Routes>
      <Route element={<AuthenticatedRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

function AuthenticatedRoute() {
  const token = useAuthStore.getState().token;

  if (token) {
    return <Navigate to="/dashboard/home" />;
  }
  return <Outlet />;
}
