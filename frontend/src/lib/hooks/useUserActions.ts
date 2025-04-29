import { useEffect, useState } from "react";
import { useUserStore } from "../store/user";

interface Params {
  limit?: number;
  page?: number;
  search?: string;
  role?: string;
  status?: string;
}

const INITIAL_PAGE = 1;

export function useGetUsers({ limit = 10, search, role, status }: Params) {
  const [loading, setLoading] = useState(false);
  const users = useUserStore((state) => state.users);
  const pagination = useUserStore((state) => state.pagination);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const removeUser = useUserStore((state) => state.removeUser);

  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

  useEffect(() => {
    setLoading(true);
    fetchUsers({
      limit,
      page: currentPage,
      search,
      role,
      status,
    }).finally(() => setLoading(false));
  }, [fetchUsers, currentPage, search, role, status]);

  return { users, removeUser, pagination, setCurrentPage, loading };
}
