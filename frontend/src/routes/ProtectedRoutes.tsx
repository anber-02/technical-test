import { Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Home } from "../pages/dashboard/Home";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { useAuthStore } from "../lib/store/auth";
import { validateToken } from "../lib/helpers/validate-token";

interface Props {
  children?: React.ReactNode;
}

export function ProtectedRoutes() {
  return (
    <Routes>
      <Route element={<ValidateRoutes />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/home" element={<Home />} />
        </Route>
        <Route path="*" element={<h1>Not found</h1>} />
      </Route>
    </Routes>
  );
}

function ValidateRoutes({ children }: Props) {
  const navigate = useNavigate();
  const token = useAuthStore.getState().token;
  const logout = useAuthStore((state) => state.logout);
  const validate = validateToken(token);

  useEffect(() => {
    if (!token || !validate) {
      logout();
      navigate("/login");
    }
  }, []);

  if (token.length === 0) {
    return <Navigate to="/login" />;
  }

  // El outlet nos ayudan a envolver multiples rutas o componentes de react router dom

  return children ?? <Outlet />;
}
