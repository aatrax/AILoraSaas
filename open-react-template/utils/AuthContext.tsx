"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  username: string | null;
  phone: string | null;
  coin: number | null;
  login: (token: string, username: string, phone: string, coin: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [coin, setCoin] = useState<number | null>(null);

  // Using useEffect to set localStorage values after the component mounts
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUsername(localStorage.getItem("username"));
    setPhone(localStorage.getItem("phone"));
    setCoin(Number(localStorage.getItem("coin")));
  }, []);

  const login = (newToken: string, username: string, phone: string, coin: number) => {
    setToken(newToken);
    setUsername(username);
    setPhone(phone);
    setCoin(coin);

    localStorage.setItem("token", newToken);
    localStorage.setItem("username", username);
    localStorage.setItem("phone", phone);
    localStorage.setItem("coin", coin.toString());
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("phone");
    localStorage.removeItem("coin");
    setToken(null);
    setUsername(null);
    setPhone(null);
    setCoin(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, phone, coin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
