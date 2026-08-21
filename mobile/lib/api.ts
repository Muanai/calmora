import axios from "axios";
import { useAuth } from "@clerk/expo";

// Default to localhost for development if not provided
const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  const { getToken } = useAuth();

  const authenticatedApi = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  authenticatedApi.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error getting token for API request:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return authenticatedApi;
};
