import { createContext, useState } from "react";
import type { User } from "../../types";


interface AuthContextType {
    //todo refactor
    user: User | undefined | any;
    setUser: React.Dispatch<React.SetStateAction<User | undefined | any>>;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}