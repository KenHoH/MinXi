import axios from "axios";
import { AuthService } from "./api";

const http = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refreshToken="))
        ?.split("=")[1];

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        await AuthService.authControllerRefresh({
          refreshToken: refreshToken,
        });
        return http(original);
      } catch (refreshError) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default http;
