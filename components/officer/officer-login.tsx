"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Shield, Building, AlertCircle, Mic, TestTube, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useVoice } from "@/hooks/use-voice"
import { officerLogin, loginByVoice } from "@/lib/api-client"
import { useDemo } from "@/contexts/DemoContext"

export function OfficerLogin() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<"password" | "voice" | "demo" | "">("")
  const [credentials, setCredentials] = useState({
    employeeId: "",
    password: "",
    department: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { isRecording, transcript, startRecording, stopRecording, clearTranscript } = useVoice()
  const { isDemoMode, setDemoMode, createDemoOfficer } = useDemo()

  const departments = [
    "Revenue Department",
    "Agriculture Department",
    "Health & Family Welfare",
    "Education Department",
    "Rural Development",
    "Social Welfare",
    "Transport Department",
  ]

  const roles = ["Verifier", "Admin", "Moderator", "Senior Officer", "District Collector"]

  const handlePasswordLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await officerLogin(credentials)
      if (response.success) {
        localStorage.setItem("officer_token", response.data.token)
        localStorage.setItem("officer_data", JSON.stringify(response.data.officer))
        router.push("/officer/dashboard")
      } else {
        setError(response.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceLogin = async () => {
    if (!transcript) {
      setError("Please record your voice command first")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await loginByVoice(transcript, credentials.department)
      if (response.success) {
        localStorage.setItem("officer_token", response.data.token)
        localStorage.setItem("officer_data", JSON.stringify(response.data.officer))
        router.push("/officer/dashboard")
      } else {
        setError(response.error || "Voice login failed")
      }
    } catch (err) {
      setError("Voice authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoModeClick = () => {
    if (!isDemoMode) {
      setDemoMode(true)
    }
    setLoginMethod("demo")
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate demo login delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Enable demo mode if not already enabled
      if (!isDemoMode) {
        setDemoMode(true)
      }

      // Create demo officer
      const demoOfficer = createDemoOfficer()

      // Set demo tokens
      localStorage.setItem("demo_officer_token", "demo-token-123")
      localStorage.setItem("officer_token", "demo-token-123")
      localStorage.setItem("officer_data", JSON.stringify(demoOfficer))

      router.push("/officer/dashboard")
    } catch (err) {
      setError("Demo login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                <Building className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Officer Portal</h1>
                <p className="text-sm text-slate-400">Government of Tamil Nadu</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Officer Login</h1>
            <p className="text-slate-300">Access the department portal securely</p>
          </div>

          {/* Demo Mode Banner */}
          <div
            className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-500 cursor-pointer hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-lg"
            onClick={handleDemoModeClick}
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <TestTube className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Demo Mode</h3>
                <p className="text-sm text-blue-100">Try the application with sample data</p>
              </div>
              <Play className="h-5 w-5 text-white" />
            </div>
          </div>

          {error && (
            <Alert className="border-red-500/50 bg-red-500/10 mb-6">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {!loginMethod && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Select Login Method</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose your preferred authentication method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="p-4 rounded-lg border-2 border-slate-600 hover:border-orange-500 cursor-pointer transition-all"
                  onClick={() => setLoginMethod("password")}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-orange-400" />
                    <div>
                      <h3 className="font-semibold text-white">Password Login</h3>
                      <p className="text-sm text-slate-400">Login with Employee ID and password</p>
                    </div>
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg border-2 border-slate-600 hover:border-orange-500 cursor-pointer transition-all"
                  onClick={() => setLoginMethod("voice")}
                >
                  <div className="flex items-center space-x-3">
                    <Mic className="h-5 w-5 text-orange-400" />
                    <div>
                      <h3 className="font-semibold text-white">Voice Authentication</h3>
                      <p className="text-sm text-slate-400">Secure voice-based login</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loginMethod === "demo" && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TestTube className="h-5 w-5 text-blue-400" />
                  <span>Demo Mode Login</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Experience the officer portal with sample data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center space-x-2 mb-3">
                    <TestTube className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400 font-semibold">Demo Officer Profile</span>
                  </div>
                  <div className="text-sm text-slate-300 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-slate-400">Name:</p>
                        <p className="font-medium">Rajesh Kumar</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Employee ID:</p>
                        <p className="font-medium">EMP001234</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Department:</p>
                        <p className="font-medium">Revenue Dept.</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Role:</p>
                        <p className="font-medium">Admin</p>
                      </div>
                      <div>
                        <p className="text-slate-400">District:</p>
                        <p className="font-medium">Chennai</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Office:</p>
                        <p className="font-medium">Collectorate</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    <span className="text-green-400 font-medium text-sm">Demo Features Available</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• Sample applications to review</li>
                    <li>• Document verification workspace</li>
                    <li>• Officer forum and community</li>
                    <li>• Certificate generation tools</li>
                    <li>• AI-powered assistance</li>
                  </ul>
                </div>

                <Button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Initializing Demo...
                    </>
                  ) : (
                    <>
                      <TestTube className="mr-2 h-4 w-4" />
                      Start Demo Experience
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setLoginMethod("")}
                  className="w-full text-slate-400 hover:text-white"
                >
                  Back to Login Options
                </Button>
              </CardContent>
            </Card>
          )}

          {loginMethod === "password" && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-orange-400" />
                  <span>Password Authentication</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Enter your official credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-white">
                    Employee ID
                  </Label>
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="EMP001234"
                    value={credentials.employeeId}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, employeeId: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-white">
                    Department
                  </Label>
                  <Select
                    value={credentials.department}
                    onValueChange={(value) => setCredentials((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">
                    Role
                  </Label>
                  <Select
                    value={credentials.role}
                    onValueChange={(value) => setCredentials((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handlePasswordLogin}
                  disabled={
                    !credentials.employeeId ||
                    !credentials.password ||
                    !credentials.department ||
                    !credentials.role ||
                    isLoading
                  }
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                >
                  {isLoading ? "Authenticating..." : "Login"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setLoginMethod("")}
                  className="w-full text-slate-400 hover:text-white"
                >
                  Back to Login Options
                </Button>
              </CardContent>
            </Card>
          )}

          {loginMethod === "voice" && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Mic className="h-5 w-5 text-orange-400" />
                  <span>Voice Authentication</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Speak your authentication phrase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-white">
                    Department
                  </Label>
                  <Select
                    value={credentials.department}
                    onValueChange={(value) => setCredentials((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center space-y-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`${
                      isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-orange-500 hover:bg-orange-600"
                    } text-white`}
                    size="lg"
                  >
                    {isRecording ? <Mic className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    {isRecording ? "Stop Recording" : "Start Voice Authentication"}
                  </Button>

                  {isRecording && (
                    <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                      Recording... Speak your authentication phrase
                    </Badge>
                  )}
                </div>

                {transcript && (
                  <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                    <p className="text-sm text-slate-400 mb-1">Voice Input:</p>
                    <p className="text-white">{transcript}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearTranscript}
                      className="mt-2 text-slate-400 hover:text-white"
                    >
                      Clear & Try Again
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleVoiceLogin}
                  disabled={!transcript || !credentials.department || isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                >
                  {isLoading ? "Authenticating..." : "Authenticate with Voice"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setLoginMethod("")}
                  className="w-full text-slate-400 hover:text-white"
                >
                  Back to Login Options
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
