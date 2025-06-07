import axios from "axios";
import { addToast } from "@heroui/react"; 
import { obtenerNuevoToken } from "./refresh"; 

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const newToken = await obtenerNuevoToken(refreshToken);  
        localStorage.setItem("access_token", newToken);
        
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        addToast({ title: "Error", description: "Token expirado. Inicia sesión nuevamente.", timeout: 3000 });
        window.location.href = "/login"; 
      }
    }

    return Promise.reject(error);
  }
);

export default api;
