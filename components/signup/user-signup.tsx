"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, ArrowLeft, Mic, MicOff, MapPin, Phone, Volume2, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useVoice } from "@/hooks/use-voice"
import { requestOtp, verifyOtp, createGuestUser, retryOtpFlow } from "@/lib/api-client"

interface UserFormData {
  // Step 1: Mobile & OTP
  mobile: string
  otp: string

  // Step 2: Personal Information
  name: string
  aadhaar: string
  age: string
  dateOfBirth: string
  caste: string
  fatherName: string
  motherName: string

  // Step 3: Location & Preferences
  district: string
  block: string
  village: string
  pincode: string
  gpsLocation: { lat: number; lng: number } | null

  // Step 4: Voice & Consent
  voiceLanguage: "ta" | "hi" | "en"
  voiceEnabled: boolean
  consentGiven: boolean
  dataProcessingConsent: boolean
}

export function UserSignup() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)

  const { isRecording, transcript, startRecording, stopRecording, speakText, clearTranscript } = useVoice()

  const [formData, setFormData] = useState<UserFormData>({
    mobile: "",
    otp: "",
    name: "",
    aadhaar: "",
    age: "",
    dateOfBirth: "",
    caste: "",
    fatherName: "",
    motherName: "",
    district: "",
    block: "",
    village: "",
    pincode: "",
    gpsLocation: null,
    voiceLanguage: "en",
    voiceEnabled: false,
    consentGiven: false,
    dataProcessingConsent: false,
  })

  const districts = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Erode",
    "Vellore",
    "Thoothukudi",
    "Dindigul",
    "Thanjavur",
    "Kanchipuram",
  ]

  const castes = ["General", "OBC", "SC", "ST", "MBC", "BC", "Others"]

  // Voice command processing
  useEffect(() => {
    if (transcript && voiceMode) {
      processVoiceInput(transcript)
    }
  }, [transcript, voiceMode])

  const processVoiceInput = async (voiceText: string) => {
    const lowerText = voiceText.toLowerCase()

    if (currentStep === 1 && lowerText.includes("mobile")) {
      // Extract mobile number from voice
      const mobileMatch = voiceText.match(/\d{10}/)
      if (mobileMatch) {
        setFormData((prev) => ({ ...prev, mobile: mobileMatch[0] }))
        await speakText("Mobile number captured. Should I send OTP?")
      }
    } else if (currentStep === 2) {
      // Process personal information via voice
      if (lowerText.includes("name")) {
        const nameMatch = voiceText.match(/name is (.+?)(?:\.|$)/i)
        if (nameMatch) {
          setFormData((prev) => ({ ...prev, name: nameMatch[1].trim() }))
          await speakText(`Name set as ${nameMatch[1].trim()}`)
        }
      }
    }

    clearTranscript()
  }

  const handleSpeakToBegin = async () => {
    setVoiceMode(true)
    await speakText("Welcome to Tamil Nadu Digital Services. Please tell me your mobile number to begin registration.")
    startRecording()
  }

  const handleSendOTP = async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await requestOtp(formData.mobile)
      if (response.success) {
        setOtpSent(true)
        if (voiceMode) {
          await speakText("OTP sent to your mobile number. Please enter the 6-digit code.")
        }
      } else {
        setError(response.error || "Failed to send OTP")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError("Please enter the 6-digit OTP")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await verifyOtp(formData.mobile, formData.otp)
      if (response.success) {
        setCurrentStep(2)
        if (voiceMode) {
          await speakText("OTP verified successfully. Now let's collect your personal information.")
        }
      } else {
        setError(response.error || "Invalid OTP")
      }
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryOTP = async () => {
    setIsLoading(true)
    try {
      const response = await retryOtpFlow(formData.mobile)
      if (response.success) {
        if (voiceMode) {
          await speakText("New OTP sent to your mobile number.")
        }
      }
    } catch (err) {
      setError("Retry failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            gpsLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }))
          if (voiceMode) {
            speakText("Location captured successfully.")
          }
        },
        (error) => {
          console.error("Location error:", error)
          setError("Unable to get location. Please enter manually.")
        },
      )
    }
  }

  const handleSubmitRegistration = async () => {
    if (!formData.consentGiven || !formData.dataProcessingConsent) {
      setError("Please provide consent to proceed with registration")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const userData = {
        phone: formData.mobile,
        name: formData.name,
        aadhaar: formData.aadhaar,
        age: Number.parseInt(formData.age),
        dateOfBirth: formData.dateOfBirth,
        caste: formData.caste,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        address: {
          district: formData.district,
          block: formData.block,
          village: formData.village,
          pincode: formData.pincode,
          gpsLocation: formData.gpsLocation,
        },
        preferred_language: formData.voiceLanguage,
        voice_enabled: formData.voiceEnabled,
        accessibility_options: [],
        consent: {
          dataProcessing: formData.dataProcessingConsent,
          voiceRecording: formData.voiceEnabled,
          locationTracking: !!formData.gpsLocation,
        },
      }

      const response = await createGuestUser(userData)
      if (response.success) {
        if (voiceMode) {
          await speakText("Registration completed successfully! Welcome to Tamil Nadu Digital Services.")
        }

        // Store user data and redirect to dashboard
        localStorage.setItem("user_token", response.data.token)
        localStorage.setItem("user_data", JSON.stringify(response.data.user))
        router.push("/citizen/dashboard")
      } else {
        setError(response.error || "Registration failed")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ")
    return formatted.slice(0, 14)
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
            <div className="flex items-center space-x-4">
              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">User Registration</h1>
                <p className="text-slate-400">Join Tamil Nadu Digital Services</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
              Step {currentStep} of 4
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10 mb-6">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Mobile & OTP */}
          {currentStep === 1 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Mobile Verification</CardTitle>
                <CardDescription className="text-slate-400">Enter your mobile number to receive OTP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Voice to Begin */}
                <div className="text-center">
                  <Button
                    onClick={handleSpeakToBegin}
                    disabled={voiceMode}
                    className="bg-purple-500 hover:bg-purple-600 text-white mb-4"
                    size="lg"
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    Speak to Begin
                  </Button>
                  {voiceMode && (
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      Voice Mode Active
                    </Badge>
                  )}
                </div>

                {/* Voice Recording Status */}
                {isRecording && (
                  <div className="text-center">
                    <Button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
                      <MicOff className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                )}

                {transcript && (
                  <Alert className="border-purple-500/50 bg-purple-500/10">
                    <Volume2 className="h-4 w-4 text-purple-400" />
                    <AlertDescription className="text-purple-200">Voice Input: {transcript}</AlertDescription>
                  </Alert>
                )}

                {/* Mobile Number Input */}
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
                      value={formData.mobile}
                      onChange={(e) => setFormData((prev) => ({ ...prev, mobile: formatMobile(e.target.value) }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 rounded-l-none"
                      maxLength={10}
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <Button
                    onClick={handleSendOTP}
                    disabled={formData.mobile.length !== 10 || isLoading}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
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
                        value={formData.otp}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, otp: e.target.value.replace(/\D/g, "").slice(0, 6) }))
                        }
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        maxLength={6}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleVerifyOTP}
                        disabled={formData.otp.length !== 6 || isLoading}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
                      >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      <Button
                        onClick={handleRetryOTP}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Retry OTP
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
                <CardDescription className="text-slate-400">Please provide your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhaar" className="text-white">
                      Aadhaar Number *
                    </Label>
                    <Input
                      id="aadhaar"
                      type="text"
                      placeholder="1234 5678 9012"
                      value={formData.aadhaar}
                      onChange={(e) => setFormData((prev) => ({ ...prev, aadhaar: formatAadhaar(e.target.value) }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      maxLength={14}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      min="18"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-white">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caste" className="text-white">
                      Caste Category
                    </Label>
                    <Select
                      value={formData.caste}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, caste: value }))}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {castes.map((caste) => (
                          <SelectItem key={caste} value={caste}>
                            {caste}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatherName" className="text-white">
                      Father's Name
                    </Label>
                    <Input
                      id="fatherName"
                      type="text"
                      placeholder="Father's full name"
                      value={formData.fatherName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fatherName: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="motherName" className="text-white">
                      Mother's Name
                    </Label>
                    <Input
                      id="motherName"
                      type="text"
                      placeholder="Mother's full name"
                      value={formData.motherName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, motherName: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!formData.name || !formData.aadhaar}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Continue to Location
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Location Information */}
          {currentStep === 3 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Location Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Help us identify your location for better service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <Button
                    onClick={handleGetLocation}
                    variant="outline"
                    className="border-teal-500 text-teal-400 hover:bg-teal-500/20"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Auto-Detect Location (GPS)
                  </Button>
                  {formData.gpsLocation && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 ml-2">
                      Location Captured
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-white">
                      District *
                    </Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, district: value }))}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="block" className="text-white">
                      Block/Taluk
                    </Label>
                    <Input
                      id="block"
                      type="text"
                      placeholder="Enter block/taluk"
                      value={formData.block}
                      onChange={(e) => setFormData((prev) => ({ ...prev, block: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="village" className="text-white">
                      Village/Town
                    </Label>
                    <Input
                      id="village"
                      type="text"
                      placeholder="Enter village/town"
                      value={formData.village}
                      onChange={(e) => setFormData((prev) => ({ ...prev, village: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-white">
                      PIN Code
                    </Label>
                    <Input
                      id="pincode"
                      type="text"
                      placeholder="600001"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))
                      }
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      maxLength={6}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setCurrentStep(4)}
                  disabled={!formData.district}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Continue to Preferences
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Voice Preferences & Consent */}
          {currentStep === 4 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Voice Preferences & Consent</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure your voice settings and provide consent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Voice Language */}
                <div className="space-y-2">
                  <Label className="text-white">Voice Language Preference</Label>
                  <Select
                    value={formData.voiceLanguage}
                    onValueChange={(value: "ta" | "hi" | "en") =>
                      setFormData((prev) => ({ ...prev, voiceLanguage: value }))
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice Enabled */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="voiceEnabled"
                    checked={formData.voiceEnabled}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, voiceEnabled: !!checked }))}
                  />
                  <Label htmlFor="voiceEnabled" className="text-white">
                    Enable voice assistance and commands
                  </Label>
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-4 p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                  <h4 className="font-semibold text-white">Required Consents</h4>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="dataConsent"
                      checked={formData.dataProcessingConsent}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, dataProcessingConsent: !!checked }))
                      }
                    />
                    <Label htmlFor="dataConsent" className="text-slate-300 text-sm leading-relaxed">
                      I consent to the processing of my personal data for government services, including Aadhaar
                      verification, document processing, and service delivery. My data will be handled as per government
                      privacy guidelines.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="generalConsent"
                      checked={formData.consentGiven}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, consentGiven: !!checked }))}
                    />
                    <Label htmlFor="generalConsent" className="text-slate-300 text-sm leading-relaxed">
                      I agree to the Terms of Service and Privacy Policy of Tamil Nadu Digital Services. I understand
                      that this platform uses AI assistance for better service delivery.
                    </Label>
                  </div>
                </div>

                <Button
                  onClick={handleSubmitRegistration}
                  disabled={!formData.consentGiven || !formData.dataProcessingConsent || isLoading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
                  size="lg"
                >
                  {isLoading ? "Creating Account..." : "Complete Registration"}
                  <CheckCircle className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
