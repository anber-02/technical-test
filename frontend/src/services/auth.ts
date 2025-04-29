interface IAuthResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    role: "USER" | "ADMIN";
    status: "ACTIVE" | "INACTIVE";
    profilePicture: string | null;
  };
}

export async function login(
  email: string,
  password: string
): Promise<IAuthResponse> {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || "Error");
  }

  const data = await response.json();
  return data;
}
