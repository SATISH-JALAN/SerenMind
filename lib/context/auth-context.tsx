"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, signIn, signUp, signInWithGoogle, signInAnonymously, signOut } from "@/lib/api/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInAnonymously: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true)
        // In a real implementation, this would check for an active session
        const storedUser = localStorage.getItem("serenmind_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        console.error("Auth status check error:", err)
        setError(err instanceof Error ? err.message : "Authentication error")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const handleSignIn = async (email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await signIn(email, password, rememberMe)
      setUser(user)
      localStorage.setItem("serenmind_user", JSON.stringify(user))
    } catch (err) {
      console.error("Sign in error:", err)
      setError(err instanceof Error ? err.message : "Sign in failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await signUp(email, password, name)
      setUser(user)
      localStorage.setItem("serenmind_user", JSON.stringify(user))
    } catch (err) {
      console.error("Sign up error:", err)
      setError(err instanceof Error ? err.message : "Sign up failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await signInWithGoogle()
      setUser(user)
      localStorage.setItem("serenmind_user", JSON.stringify(user))
    } catch (err) {
      console.error("Google sign in error:", err)
      setError(err instanceof Error ? err.message : "Google sign in failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInAnonymously = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await signInAnonymously()
      setUser(user)
      localStorage.setItem("serenmind_user", JSON.stringify(user))
    } catch (err) {
      console.error("Anonymous sign in error:", err)
      setError(err instanceof Error ? err.message : "Anonymous sign in failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signOut()
      setUser(null)
      localStorage.removeItem("serenmind_user")
    } catch (err) {
      console.error("Sign out error:", err)
      setError(err instanceof Error ? err.message : "Sign out failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signInWithGoogle: handleSignInWithGoogle,
        signInAnonymously: handleSignInAnonymously,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

