
import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../api/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const saveUser = (userData) => {
        sessionStorage.setItem("token", userData.token);

        const userInfo = {
            id: userData.id,
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role
        };

        sessionStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
    };

    const login = async (loginData) => {
        const response = await loginUser(loginData);
        saveUser(response.data);
        return response.data;
    };

    const register = async (userData) => {
        const response = await registerUser(userData);
        saveUser(response.data);
        return response.data;
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, isLoggedIn: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
