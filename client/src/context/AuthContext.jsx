import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

/* ── Safe localStorage helpers ──────────────────────────────────
   JSON.parse on corrupted/invalid localStorage data throws a
   SyntaxError that crashes the entire React tree during state
   initialization — producing a white screen.
   These helpers swallow parse errors gracefully.
──────────────────────────────────────────────────────────────── */
const safeGetUser = () => {
    try {
        const raw = localStorage.getItem("jobbuddy_user");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        // Validate minimal shape — must be an object with an _id
        if (!parsed || typeof parsed !== "object" || !parsed._id) {
            localStorage.removeItem("jobbuddy_user");
            return null;
        }
        return parsed;
    } catch {
        // Corrupted JSON — clear it so it doesn't keep crashing
        localStorage.removeItem("jobbuddy_user");
        return null;
    }
};

const safeSetUser = (userData) => {
    try {
        localStorage.setItem("jobbuddy_user", JSON.stringify(userData));
    } catch {
        // localStorage quota exceeded or disabled — fail silently
    }
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => safeGetUser());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Re-read from localStorage on mount (handles page refresh)
        const storedUser = safeGetUser();
        if (storedUser) {
            setCurrentUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setCurrentUser(userData);
        safeSetUser(userData);
    };

    // Call this after onboarding completes so global state reflects isOnboarded:true
    const updateUser = (updatedUserData) => {
        const merged = { ...currentUser, ...updatedUserData };
        setCurrentUser(merged);
        safeSetUser(merged);
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