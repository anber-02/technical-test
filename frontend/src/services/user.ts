import { DataPagination, IUser } from "../types";

interface Params {
  limit?: number;
  page?: number;
  search?: string;
  role?: string;
  status?: string;
}

const API_URL = "http://localhost:3000/api/users";

export async function getUsers(
  params: Params,
  token: string
): Promise<[IUser[], DataPagination]> {
  const { limit, page, search = "", role = "", status = "" } = params;
  const response = await fetch(
    `${API_URL}?limit=${limit}&page=${page}&search=${search}&role=${role}&status=${status}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.parse(errorData?.error) || "Error");
  }

  const data = await response.json();
  return [data.data, data.meta];
}

export async function deleteUser(id: number, token: string): Promise<void> {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
}

export async function updateUser(
  id: number,
  user: FormData,
  token: string
): Promise<IUser> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: user,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Error");
  }
  const data = await response.json();
  return data;
}

export async function createUser(
  user: FormData,
  token: string
): Promise<IUser> {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: user,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Error");
  }
  const data = await response.json();
  return data;
}
