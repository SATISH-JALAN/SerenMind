"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/context/auth-context"
import { usePageTransition } from "@/lib/context/page-transition-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/use-toast"

export default function SignInPage() {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const { signIn, signUp, signInWithGoogle, signInAnonymously, isLoading, user } = useAuth()
  const { startTransition } = usePageTransition()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirectPath = searchParams.get("redirect") || "/dashboard"

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isAnonymous) {
        await signInAnonymously()
        toast({
          title: "Welcome to SerenMind!",
          description: "You've been signed in anonymously.",
        })
        startTransition(redirectPath)
        return
      }

      if (authMode === "signin") {
        await signIn(email, password, rememberMe)
        toast({
          title: "Welcome back!",
          description: "You've been successfully signed in.",
        })
      } else {
        await signUp(email, password, name)
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        })
      }
      startTransition(redirectPath)
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "An error occurred during authentication.",
        variant: "destructive",
      })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast({
        title: "Welcome to SerenMind!",
        description: "You've been successfully signed in with Google.",
      })
      startTransition(redirectPath)
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "An error occurred during Google authentication.",
        variant: "destructive",
      })
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleAnonymousMode = () => {
    setIsAnonymous(!isAnonymous)
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 text-[#333333] dark:text-gray-100 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-800"
          onClick={() => startTransition("/")}
        >
          <ArrowLeft size={20} className="text-[#6A9FB5]" />
        </Button>
      </div>

      <Link href="/" className="flex items-center space-x-2 mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6A9FB5] to-[#A3D9A5] flex items-center justify-center"
        >
          <span className="text-white font-bold text-lg">S</span>
        </motion.div>
        <span className="font-semibold text-xl">SerenMind</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-[#6A9FB5]/20 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isAnonymous ? "Anonymous Mode" : authMode === "signin" ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isAnonymous
                ? "Use SerenMind without creating an account"
                : authMode === "signin"
                  ? "Sign in to your account to continue"
                  : "Enter your details to create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isAnonymous && (
                  <motion.div
                    key="auth-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {authMode === "signup" && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <div className="relative">
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={authMode === "signup"}
                            className="pl-10 border-[#6A9FB5]/30 focus-visible:ring-[#6A9FB5]"
                          />
                          <User
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 border-[#6A9FB5]/30 focus-visible:ring-[#6A9FB5]"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        {authMode === "signin" && (
                          <Link href="/forgot-password" className="text-xs text-[#6A9FB5] hover:underline">
                            Forgot password?
                          </Link>
                        )}
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pl-10 pr-10 border-[#6A9FB5]/30 focus-visible:ring-[#6A9FB5]"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>
                    {authMode === "signin" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked === true)}
                          className="data-[state=checked]:bg-[#6A9FB5] data-[state=checked]:border-[#6A9FB5]"
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                    className="data-[state=checked]:bg-[#6A9FB5] data-[state=checked]:border-[#6A9FB5]"
                  />
                  <label
                    htmlFor="anonymous"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Use anonymous mode
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      {isAnonymous
                        ? "Signing in anonymously..."
                        : authMode === "signin"
                          ? "Signing in..."
                          : "Creating account..."}
                    </>
                  ) : (
                    <>{isAnonymous ? "Continue Anonymously" : authMode === "signin" ? "Sign In" : "Create Account"}</>
                  )}
                </Button>
              </div>

              {!isAnonymous && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-[#6A9FB5]/20" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#6A9FB5]/30 hover:bg-[#F5E1DA]/30 hover:text-[#6A9FB5] transition-all duration-300"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                </>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!isAnonymous && (
              <div className="text-center text-sm">
                {authMode === "signin" ? (
                  <div>
                    Don't have an account?{" "}
                    <button
                      className="text-[#6A9FB5] hover:underline font-medium"
                      onClick={() => setAuthMode("signup")}
                    >
                      Sign up
                    </button>
                  </div>
                ) : (
                  <div>
                    Already have an account?{" "}
                    <button
                      className="text-[#6A9FB5] hover:underline font-medium"
                      onClick={() => setAuthMode("signin")}
                    >
                      Sign in
                    </button>
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-[#6A9FB5] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#6A9FB5] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

