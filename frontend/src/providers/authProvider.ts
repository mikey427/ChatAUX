import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import React from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      const response = await fetch("/api/user", { credentials: "include" });
      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.log("Not authenticated");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      },
    },
    children
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
