import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("nanotools-auth");
  if (stored) {
    const { state } = JSON.parse(stored);
    if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(err.config);
      } catch (_) {
        localStorage.removeItem("nanotools-auth");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
