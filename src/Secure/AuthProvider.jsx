import React, { createContext, useState, useEffect } from "react";
import {
  getAccessToken,
  deleteAccessToken,
  deleteRefreshToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "./secureHub";

import APIService from "../services/APIService";
import { config } from "../services/config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);

    try {
      const token = await getRefreshToken();

      if (!token) {
        setUser(null);
        return;
      }

      const response = await APIService.get(
        config.endpoints.legacy.auth.checkAuth,
        {},
      );

      if (response?.data.error) {
        setUser(null);
      } else {
        setUser(response?.data.user);
      }
    } catch (error) {
      console.log("Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    await deleteAccessToken();
    await deleteRefreshToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
