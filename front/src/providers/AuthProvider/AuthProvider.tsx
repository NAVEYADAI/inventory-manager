import { createContext, useState } from "react";
import type { User } from "../../types";


interface AuthContextType {
    user: User | undefined; // מומלץ בהמשך להחליף את any בממשק מסודר של משתמש, למשל User
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
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