import Cookies from "js-cookie";

const COOKIE_NAME = "user_login";

type LoginData = {
  username: string;
  password: string;
  user_id: string;
  email: string;
  account_type: string;
  has_free_chat: boolean;
  has_safe_chat: boolean;
  has_safe_server_access: boolean;
};

export const setLoginCookie = (data: LoginData, expiresInDays: number = 7) => {
  // Convert the data to a JSON string and store it in the cookie
  Cookies.set(COOKIE_NAME, JSON.stringify(data), { expires: expiresInDays });
  return;
};

export const getUserId = (): string | undefined => {
  const cookie = getLoginCookie();
  return cookie ? cookie.user_id : undefined;
};

export const getLoginCookie = (): LoginData | undefined => {
  const cookie = Cookies.get(COOKIE_NAME);
  // Parse the cookie JSON string back into an object
  return cookie ? JSON.parse(cookie) : undefined;
};

export const removeLoginCookie = () => {
  Cookies.remove(COOKIE_NAME);
};

export const isLoggedIn = (): boolean => {
  return Boolean(getLoginCookie());
};
