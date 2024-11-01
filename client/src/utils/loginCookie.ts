import Cookies from "js-cookie";

const COOKIE_NAME = "user_login";

type LoginData = {
  username: string;
  password: string;
};

export const setLoginCookie = (data: LoginData, expiresInDays: number = 7) => {
  // Convert the data to a JSON string and store it in the cookie
  Cookies.set(COOKIE_NAME, JSON.stringify(data), { expires: expiresInDays });
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
