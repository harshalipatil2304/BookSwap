import axiosInstance from "./axiosInstance";

export const registerUser = (userData) =>
    axiosInstance.post("/auth/register", userData);

export const loginUser = (loginData) =>
    axiosInstance.post("/auth/login", loginData);
