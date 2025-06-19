"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Shield, Smartphone, CreditCard, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CitizenLogin() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<"aadhaar" | "mobile" | "">("")
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setOtpSent(true)
      setIsLoading(false)
    }, 2000)
  }

  const handleVerifyOTP = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/citizen/dashboard")
    }, 2000)
  }

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ")
    return formatted.slice(0, 14) // 12 digits + 2 spaces
  }

  const formatMobile = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    return cleaned.slice(0, 10)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Badge variant="secondary" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
              Step 2 of 3
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-teal-500/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-teal-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Secure Login</h1>
            <p className="text-slate-300">Choose your preferred authentication method</p>
          </div>

          {!loginMethod && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Select Login Method</CardTitle>
                <CardDescription className="text-slate-400">Choose how you'd like to authenticate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="p-4 rounded-lg border-2 border-slate-600 hover:border-teal-500 cursor-pointer transition-all"
                  onClick={() => setLoginMethod("aadhaar")}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-teal-400" />
                    <div>
                      <h3 className="font-semibold text-white">Aadhaar Authentication</h3>
                      <p className="text-sm text-slate-400">Secure login with your Aadhaar number</p>
                    </div>
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg border-2 border-slate-600 hover:border-teal-500 cursor-pointer transition-all"
                  onClick={() => setLoginMethod("mobile")}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-teal-400" />
                    <div>
                      <h3 className="font-semibold text-white">Mobile OTP</h3>
                      <p className="text-sm text-slate-400">Login with mobile number and OTP</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loginMethod === "aadhaar" && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-teal-400" />
                  <span>Aadhaar Authentication</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Enter your 12-digit Aadhaar number</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200">
                    Your Aadhaar details are encrypted and secure. We follow all government privacy guidelines.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar" className="text-white">
                    Aadhaar Number
                  </Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="1234 5678 9012"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(formatAadhaar(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    maxLength={14}
                  />
                </div>

                {!otpSent ? (
                  <Button
                    onClick={handleSendOTP}
                    disabled={aadhaarNumber.length !== 14 || isLoading}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-white">
                        Enter OTP
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        maxLength={6}
                      />
                    </div>
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6 || isLoading}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
                    >
                      {isLoading ? "Verifying..." : "Verify & Login"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Button
                  variant="ghost"
                  onClick={() => setLoginMethod("")}
                  className="w-full text-slate-400 hover:text-white"
                >
                  Choose Different Method
                </Button>
              </CardContent>
            </Card>
          )}

          {loginMethod === "mobile" && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-teal-400" />
                  <span>Mobile Authentication</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Enter your registered mobile number</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-white">
                    Mobile Number
                  </Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-slate-700 border border-slate-600 rounded-l-md">
                      <span className="text-white">+91</span>
                    </div>
                    <Input
                      id="mobile"
                      type="text"
                      placeholder="9876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(formatMobile(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 rounded-l-none"
                      maxLength={10}
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <Button
                    onClick={handleSendOTP}
                    disabled={mobileNumber.length !== 10 || isLoading}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-white">
                        Enter OTP
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        maxLength={6}
                      />
                    </div>
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6 || isLoading}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
                    >
                      {isLoading ? "Verifying..." : "Verify & Login"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Button
                  variant="ghost"
                  onClick={() => setLoginMethod("")}
                  className="w-full text-slate-400 hover:text-white"
                >
                  Choose Different Method
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
