import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true" || false
    );

    // Create axios instance with base configuration
    const api = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URI,
        timeout: 10000, // 10 second timeout
    });

    // Add request interceptor to include token in headers
    api.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor to handle auth errors
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            // If token is invalid or expired, logout user
            if (error.response?.status === 401) {
                console.warn("Token expired or invalid, logging out...");
                logout();
            }
            return Promise.reject(error);
        }
    );

    // Save token
    const saveToken = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    // Logout
    const logout = () => {
        setToken("");
        localStorage.removeItem("token");
        // Optionally redirect to login page
        // window.location.href = "/login";
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            localStorage.setItem("darkMode", !prev);
            return !prev;
        });
    };

    // Update <html> class globally
    useEffect(() => {
        const html = document.documentElement;
        if (darkMode) html.classList.add("dark");
        else html.classList.remove("dark");
    }, [darkMode]);

    // Helper function to check if user is authenticated
    const isAuthenticated = () => {
        return !!token;
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                saveToken,
                logout,
                darkMode,
                toggleDarkMode,
                api,  // ✅ Expose configured axios instance
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);