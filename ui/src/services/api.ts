import axios from "axios";
import { getToken } from "./localStorage";
const api = axios.create({
  baseURL: "http://localhost:3000",
});
// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("ERROR_HANDLING");
    if (error.response.status === 401) {
      //   window.location.href = "/";
    }
  },
);
export { api };
