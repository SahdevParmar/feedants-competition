import api from '@/api/client'
import React, { Children, createContext, useContext, useEffect, useState } from 'react'



const AuthContext=createContext(null)

export function AuthProvider ({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const checkAuth=async ()=>{
        try {
            const res=await api.get("/api/auth/me")
            setUser(res.data.user)
        } catch (error) {
            setUser(null)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        checkAuth()
    },[])

    const login=async(email,password)=>{
        const res= await api.post("/api/auth/login",{email,password})
        setUser(res.data.user)
        return res.data.user;
    }

    const signup = async ({ name, username, email, password }) => {
  const res = await api.post("/api/auth/signup", { name, username, email, password });
  setUser(res.data.user);
  return res.data.user;
};

    const logout=async () => {
        await api.post("/api/auth/logout")
        setUser(null);
    }

  return (
    <AuthContext.Provider value={{user,loading,login,signup,logout,checkAuth}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.error("useAuth called outside AuthProvider. Stack:", new Error().stack);
  }
  return ctx;
};