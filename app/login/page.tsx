"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, User, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { userAuth, userSession } from "@/lib/userAuth"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    if (userSession.isLoggedIn()) {
      router.push("/")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    console.log("Attempting to authenticate:", { name: name.trim(), passwordLength: password.length })

    try {
      const result = await userAuth.authenticate(name, password)
      console.log("Authentication result:", result)

      if (result.success && result.user) {
        // Store user session
        userSession.setUser(result.user)

        if (result.isNewUser) {
          setSuccess(`Welcome ${result.user.name}! Your account has been created and saved to the database.`)
        } else {
          setSuccess(`Welcome back, ${result.user.name}!`)
        }

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setError(result.error || "Authentication failed. Please try again.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestAccess = () => {
    router.push("/?guest=true")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="absolute -top-2 -left-2 text-gray-600 hover:text-black">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-black mb-2">Welcome to RateIt</h1>
          <p className="text-gray-600">Sign in to your account or create a new one</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder:text-gray-500 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 h-12 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder:text-gray-500 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {/* Password length indicator for debugging */}
                {password.length > 0 && (
                  <p className="text-xs text-gray-500">Password length: {password.length} characters</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !name.trim() || !password}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 h-12 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Sign In / Sign Up"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Guest Access */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGuestAccess}
              disabled={isLoading}
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 h-12 rounded-xl font-medium bg-transparent disabled:opacity-50"
            >
              Continue as Guest
            </Button>

            {/* Info Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                New users will be automatically registered and saved to the database.
                <br />
                Your account data persists between sessions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
          <p className="text-xs text-gray-600">
            <strong>Name:</strong> Demo User
            <br />
            <strong>Password:</strong> demo123
          </p>
          <p className="text-xs text-gray-500 mt-2">Or create a new account by entering any name and password.</p>
        </div>
      </div>
    </div>
  )
}
