"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Globe, Users, Shield, Zap, MessageCircle, FileText, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

export function WelcomePage() {
  const router = useRouter()
  const [userType, setUserType] = useState<"citizen" | "officer" | null>(null)

  const handleGetStarted = () => {
    if (userType === "citizen") {
      router.push("/citizen/language-setup")
    } else if (userType === "officer") {
      router.push("/officer/login")
    }
  }

  const handleSignUp = () => {
    if (userType === "citizen") {
      router.push("/signup-user")
    } else if (userType === "officer") {
      router.push("/signup-officer")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                <Shield className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Tamil Nadu Digital Services</h1>
                <p className="text-sm text-slate-400">AI-Enabled Governance Platform</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Beta Version
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Digital Governance
            <span className="block text-yellow-400">Made Simple</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Access government services, upload documents, get AI assistance, and connect with your community - all in
            one secure platform.
          </p>
        </div>

        {/* User Type Selection */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-semibold text-white text-center mb-8">Choose Your Access Type</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className={`cursor-pointer transition-all duration-300 border-2 ${
                userType === "citizen"
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
              }`}
              onClick={() => setUserType("citizen")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-teal-400" />
                </div>
                <CardTitle className="text-white">Citizen Portal</CardTitle>
                <CardDescription className="text-slate-400">
                  Access government services, apply for certificates, and get AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-teal-400" />
                    <span>Apply for certificates and schemes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-teal-400" />
                    <span>AI-powered assistance in multiple languages</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-teal-400" />
                    <span>Community forum and support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all duration-300 border-2 ${
                userType === "officer"
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
              }`}
              onClick={() => setUserType("officer")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-orange-400" />
                </div>
                <CardTitle className="text-white">Officer Portal</CardTitle>
                <CardDescription className="text-slate-400">
                  Review applications, manage documents, and use AI-assisted verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-orange-400" />
                    <span>Review and verify citizen applications</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-orange-400" />
                    <span>AI-powered document analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-orange-400" />
                    <span>Manage citizen queries and forum</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleGetStarted}
              disabled={!userType}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-8 py-3 text-lg"
            >
              Login / Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              onClick={handleSignUp}
              disabled={!userType}
              variant="outline"
              size="lg"
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 px-8 py-3 text-lg"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Sign Up
            </Button>
          </div>

          <p className="text-sm text-slate-400">
            {userType === "citizen"
              ? "New citizen? Sign up to create your account and access all government services."
              : userType === "officer"
                ? "New officer? Register to get access to the department portal."
                : "Select citizen or officer portal above to continue"}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
            <p className="text-slate-400">Get help in Tamil, Hindi, and English with voice and text support</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure & Transparent</h3>
            <p className="text-slate-400">Aadhaar-based authentication with full transparency in AI decisions</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Globe className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Offline Support</h3>
            <p className="text-slate-400">Works in rural areas with offline mode and data synchronization</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 Government of Tamil Nadu. All rights reserved.</p>
            <p className="mt-2 text-sm">Powered by AI for transparent and efficient governance</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
