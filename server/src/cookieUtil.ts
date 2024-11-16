import { parse } from "cookie";

export const parseLoginCookie = (cookieHeader: string | undefined) => {
  if (!cookieHeader) return null;

  try {
    // Parse the cookies from the cookie header
    const cookies = parse(cookieHeader);

    // Extract the specific cookie (e.g., "user_login")
    const loginCookie = cookies["user_login"];
    if (!loginCookie) return null;

    // Parse the JSON string stored in the cookie
    return JSON.parse(loginCookie);
  } catch (err) {
    console.error("Failed to parse login cookie:", err);
    return null;
  }
};