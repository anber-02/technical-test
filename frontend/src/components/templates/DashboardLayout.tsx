import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../lib/store/auth";

export function DashboardLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  return (
    <div className="w-full">
      <header className="  px-4 py-1.5 flex gap-4 justify-end items-center shadow-md">
        <button
          className="btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </header>
      <main className="bg-white h-[calc(100vh-64px)] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
