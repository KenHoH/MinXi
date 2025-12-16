import axios from "axios";

const http = axios.create({
  baseURL: "/",
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

    if (error.response?.status === 403 && !original._retry) {
      original._retry = true;

      const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refreshToken="))
        ?.split("=")[1];

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const refreshHttp = axios.create({
          baseURL: "/",
          withCredentials: true,
        });
        await refreshHttp.post(
          "/auth/refresh",
          { refreshToken: refreshToken },
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        return http(original);
      } catch (refreshError) {
        const clearCookie = (name: string) => {
          document.cookie = `${name}=; path=/; max-age=0`;
        };
        clearCookie("accessToken");
        clearCookie("refreshToken");
        clearCookie("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default http;
