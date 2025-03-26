"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { usePageTransition } from "@/lib/context/page-transition-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { auth, provider } from "@/lib/firebase"; // Import Firebase auth
import { signInWithPopup } from "firebase/auth";

export default function SignInPage() {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { startTransition } = usePageTransition();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User Logged In:", result.user);
      toast({
        title: "Welcome to SerenMind!",
        description: "You've been successfully signed in with Google.",
      });
      startTransition(redirectPath);
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "An error occurred during Google authentication.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{authMode === "signin" ? "Sign In" : "Sign Up"}</CardTitle>
          <CardDescription>Access your account easily</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            {authMode === "signup" && (
              <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-3">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full mt-4">
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm">
            {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")} className="text-blue-500 underline">
              {authMode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
