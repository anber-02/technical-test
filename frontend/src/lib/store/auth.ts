import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login } from "../../services/auth";

interface State {
  token: string;
  error: string | null;
  loading: boolean;
  handleAuthentication: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
// El persist es un middleware de zustand que nos permite guardar el estado en el localStorage
export const useAuthStore = create(
  persist<State>(
    (set) => ({
      token: "",
      error: null,
      loading: false,

      handleAuthentication: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const data = await login(email, password);
          set({ token: data.token, loading: false, error: null });
        } catch (error) {
          set({
            token: "",
            loading: false,
            error: error instanceof Error ? error.message : "Error",
          });
        }
      },
      logout: () => {
        set({ token: "" });
      },
    }),
    {
      name: "auth-token",
    }
  )
);
