import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  iat: number;
}

export const validateToken = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (e) {
    return false;
  }
};
