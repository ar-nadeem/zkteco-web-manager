import axios from "axios";
import {
  DeviceSettings,
  AttendanceSettings,
  // UserSettings,
  Message,
} from "./types";

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("API_BASE_URL is not defined in environment variables");
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API Functions
export const userAPI = {
  getUsers: async (deviceSettings: DeviceSettings) => {
    try {
      const response = await api.post("/get_users", deviceSettings);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
};

export const attendanceAPI = {
  getAttendance: async (
    deviceSettings: DeviceSettings,
    attendanceSettings?: AttendanceSettings
  ) => {
    try {
      const response = await api.post("/get_attendance", {
        device_settings: deviceSettings,
        attendance_settings: attendanceSettings || {},
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  },
};

export const deviceAPI = {
  testConnection: async (deviceSettings: DeviceSettings): Promise<Message> => {
    try {
      const response = await api.post("/test", deviceSettings);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        throw new Error(
          error.response.data.detail || "Unable to connect to device"
        );
      }
      console.error("Error testing device connection:", error);
      throw error;
    }
  },
};

// Error handler middleware
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
