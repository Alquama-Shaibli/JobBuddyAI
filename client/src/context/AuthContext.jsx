import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(
        JSON.parse(localStorage.getItem("jobbuddy_user")) || null
    )
    const [ loading, setLoading ] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("jobbuddy_user"));
        if (storedUser) {
            setCurrentUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = (userData) =>{
        setCurrentUser(userData);

        localStorage.setItem("jobbuddy_user", JSON.stringify(userData));
    }

    const logout = () => {
        setCurrentUser(null);

        localStorage.removeItem("jobbuddy_user");
        navigate("/sign-in");
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};