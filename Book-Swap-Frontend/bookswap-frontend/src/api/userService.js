
import axiosInstance from "./axiosInstance";

// Get all users
export const getAllUsers = () => {
    return axiosInstance.get("/users");
};

// Get user by ID
export const getUserById = (id) => {
    return axiosInstance.get(`/users/${id}`);
};
