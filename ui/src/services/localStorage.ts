const TOKEN_KEY = "XYZ_APP_TOKEN";
const USER_KEY = "user";
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token;
};

export const setToken = (token: string) => {
  saveToLocalStorage(TOKEN_KEY, token);
};

const saveToLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const setUser = (userData: string) => {
  localStorage.setItem(USER_KEY, userData);
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
