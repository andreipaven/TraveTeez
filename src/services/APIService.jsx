// APIService.js
import axios from "axios";
import { config } from "./config";
import { getAccessToken } from "../Secure/secureHub";

const http = axios.create({
  baseURL: config.legacyBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (req) => {
    const token = await getAccessToken();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default class APIService {
  static get(endpoint, config = {}) {
    return http.get(endpoint, config);
  }

  static post(endpoint, data, config = {}) {
    return http.post(endpoint, data, config);
  }
}
