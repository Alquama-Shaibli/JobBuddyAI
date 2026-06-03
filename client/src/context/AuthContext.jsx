import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("jobbuddy_user")) || null
    );
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("jobbuddy_user"));
        if (storedUser) {
            setCurrentUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem("jobbuddy_user", JSON.stringify(userData));
    };

    // Call this after onboarding completes so the global state reflects isOnboarded:true
    const updateUser = (updatedUserData) => {
        const merged = { ...currentUser, ...updatedUserData };
        setCurrentUser(merged);
        localStorage.setItem("jobbuddy_user", JSON.stringify(merged));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("jobbuddy_user");
        navigate("/sign-in");
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};