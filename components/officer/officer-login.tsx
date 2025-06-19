"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Shield, Building, AlertCircle, Mic, MicOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useVoice } from "@/hooks/use-voice"
import { officerLogin, loginByVoice } from "@/lib/api-client"

export function OfficerLogin() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<"password" | "voice" | "">("")
  const [credentials, setCredentials] = useState({
    employeeId: "",
    password: "",
    department: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { isRecording, transcript, startRecording, stopRecording, clearTranscript } = useVoice()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
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
                  Choose Different Method
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
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
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
