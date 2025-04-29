import { create } from "zustand";
import {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
} from "../../services/user";
import { useAuthStore } from "./auth";
import { DataPagination, IUser } from "../../types";

interface Params {
  limit?: number;
  page?: number;
  search?: string;
  role?: string;
  status?: string;
}

interface State {
  users: IUser[];
  loading: boolean;
  pagination: DataPagination;
  fetchUsers: (params: Params) => Promise<void>;
  removeUser: (id: number) => Promise<void>;
  editUser: (id: number, user: FormData) => Promise<void>;
  addUser: (user: FormData) => Promise<void>;
}

export const useUserStore = create<State>((set) => ({
  users: [],
  loading: false,
  pagination: {
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 0,
    page: 1,
    total: 0,
    totalPages: 0,
  },

  fetchUsers: async (params: Params) => {
    const token = useAuthStore.getState().token;
    set({ loading: true });
    try {
      const [fetchedUsers, meta] = await getUsers(params, token);
      set({ users: fetchedUsers, loading: false, pagination: meta });
    } catch (error) {
      throw Error(error instanceof Error ? error.message : "Error");
    } finally {
      set({
        loading: false,
      });
    }
  },

  removeUser: async (id: number) => {
    const token = useAuthStore.getState().token;
    set({ loading: true });
    try {
      await deleteUser(id, token);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
      }));
    } catch (error) {
      throw Error(error instanceof Error ? error.message : "Error");
    } finally {
      set({
        loading: false,
      });
    }
  },

  editUser: async (id: number, updatedUser: FormData) => {
    const token = useAuthStore.getState().token;
    set({ loading: true });
    try {
      const dataUser = await updateUser(id, updatedUser, token);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...dataUser } : user
        ),
        loading: false,
      }));
    } catch (error) {
      throw Error(error instanceof Error ? error.message : "Error");
    } finally {
      set({
        loading: false,
      });
    }
  },

  addUser: async (newUser: FormData) => {
    const token = useAuthStore.getState().token;
    set({ loading: true });
    try {
      const createdUser = await createUser(newUser, token);
      set((state) => ({
        users: [...state.users, createdUser],
        loading: false,
      }));
    } catch (error) {
      throw Error(error instanceof Error ? error.message : "Error");
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
