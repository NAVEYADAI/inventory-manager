import { createContext, useState } from "react";
import type { User } from "../../types";

function isTokenExpired(token: string): boolean {
    if (typeof window === "undefined") return false;
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return true;
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        if (payload.exp && Date.now() >= payload.exp * 1000) {
            return true;
        }
        return false;
    } catch {
        return true;
    }
}

interface AuthContextType {
    //todo refactor
    user: User | undefined | any;
    setUser: React.Dispatch<React.SetStateAction<User | undefined | any>>;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | undefined>(() => {
        try {
            const token = localStorage.getItem("token");
            if (token && isTokenExpired(token)) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                return undefined;
            }
            const saved = localStorage.getItem("user");
            return saved ? JSON.parse(saved) : undefined;
        } catch {
            return undefined;
        }
    });

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}