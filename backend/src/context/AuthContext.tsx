"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string;          // correspond à ce que retourne ton API
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>; 
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔹 Récupération du profil utilisateur
  async function refreshProfile(): Promise<void> {
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: "GET",
        credentials: "include",
      });

      

      if (!res.ok) {
        
        setUser(null);
        return;
      }

      const data = await res.json();
     
      setUser(data.data.user);
    } catch  {
    
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Login
  async function login(email: string, password: string): Promise<void> {
    try {
     

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const result = await res.json();
     

      if (!res.ok) {
        throw new Error(result.message || "Identifiants incorrects");
      }

      // Stockage du token côté client pour les prochaines requêtes
     

      // Mettre à jour l'utilisateur
      setUser(result.data.user);
    } catch (err) {
      
      throw err; // remonter l'erreur pour l'affichage côté formulaire
    }
  }

  // 🔹 Register
async function register(email: string, password: string): Promise<void> {
  try {
    

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const result = await res.json();
  

    if (!res.ok) {
      throw new Error(result.message || "Erreur lors de l'inscription");
    }

    // 🔥 Normalisation identique à login()
    setUser(result.data.user);

  } catch (err) {
    
    throw err;
  }
}


  // 🔹 Logout
  function logout(): void {
   
    setUser(null);
  }

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile, register }}>
      {children}
    </AuthContext.Provider>
  );
}