"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getProfile, loginUser, logoutUser, registerUser } from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current user when app starts
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await getProfile();

        setUser(res?.data || null);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Login
  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);

      const profileResponse = await getProfile();

      setUser(profileResponse?.data || null);

      return {
        success: true,
        data: res?.data || null,
      };
    } catch (error) {
      console.error("Login error:", error);

      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);

      throw error;
    }
  };

  const register = async (userData) => {
    try {
        const res = await registerUser(userData);
        return res.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
