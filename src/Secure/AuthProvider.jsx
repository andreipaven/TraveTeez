import React, { createContext, useState, useEffect } from "react";
import {
  getAccessToken,
  deleteAccessToken,
  deleteRefreshToken,
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
      const token = await getAccessToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await APIService.get(
        config.endpoints.legacy.auth.checkAuth,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUser(response.data.user);
    } catch (error) {
      console.log("Token invalid or expired", error);
      await deleteAccessToken();
      await deleteRefreshToken();
      setUser(null);
    }
    setLoading(false);
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
