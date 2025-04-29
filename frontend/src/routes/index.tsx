import { BrowserRouter } from "react-router-dom";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { PublicRoutes } from "./PublicRoutes";

export default function Routes() {
  return (
    <BrowserRouter>
      <PublicRoutes />
      <ProtectedRoutes />
    </BrowserRouter>
  );
}
