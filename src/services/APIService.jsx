// APIService.js
import axios from "axios";
import { config } from "./config";
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "../Secure/secureHub";

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

//for tokens
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    console.warn("⚠️ au adu ");

    try {
      const refreshToken = await getRefreshToken();

      const res = await APIService.post(config.endpoints.legacy.auth.refresh, {
        refresh_token: refreshToken,
      });

      if (res.status === 200) {
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        await saveAccessToken(newAccessToken);
        await saveRefreshToken(newRefreshToken);
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;

        return http.request(error.config);
      }
    } catch (err) {
      console.log("❌ Refresh token invalid or failed request:", err);
      await deleteRefreshToken();
      await deleteAccessToken();
    }
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
