"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { auth, provider } from "@/lib/firebase";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes (User stays logged in)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Sign In with Email & Password
  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Sign in failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up with Email & Password
  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err instanceof Error ? err.message : "Sign up failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In with Google
  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userCredential = await signInWithPopup(auth, provider);
      setUser(userCredential.user);
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In Anonymously
  const handleSignInAnonymously = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userCredential = await signInAnonymously(auth);
      setUser(userCredential.user);
    } catch (err) {
      console.error("Anonymous sign-in error:", err);
      setError(err instanceof Error ? err.message : "Anonymous sign-in failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Sign out error:", err);
      setError(err instanceof Error ? err.message : "Sign out failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

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
        signOut: handleSignOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}