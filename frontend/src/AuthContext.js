import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      navigate('/');
    }

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    axiosInstance.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosInstance.interceptors.response.use(undefined, error => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
      return Promise.reject(error);
    });
  }, [navigate]);

  const isTokenExpired = token => {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  };

  const contextValue = {};

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
