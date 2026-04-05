import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Admin, AuthContextType } from '../types'
import { adminLogin } from '../services/supabaseClient'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if admin is already logged in (from localStorage)
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin')
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin))
      } catch (error) {
        console.error('Failed to parse stored admin:', error)
        localStorage.removeItem('admin')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true)
      const data = await adminLogin(username, password)
      setAdmin(data)
      localStorage.setItem('admin', JSON.stringify(data))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setAdmin(null)
    localStorage.removeItem('admin')
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
