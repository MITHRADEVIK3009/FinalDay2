"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  Upload,
  Camera,
  FileText,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Save,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { DemoApiClient } from "@/lib/demo-data"

interface FormData {
  // Personal Information
  fullName: string
  aadhaarNumber: string
  dateOfBirth: string
  age: string
  gender: string
  fatherName: string
  motherName: string

  // Contact & Location
  mobileNumber: string
  district: string
  taluk: string
  village: string

  // Category & Documents
  caste: string
  casteCategory: string
  incomeCertificateNo: string
  casteCertificateNo: string

  // Documents
  uploadedDocuments: File[]

  // Consent & Confirmation
  voiceConsent: boolean
  documentReadiness: boolean
  privacyConsent: boolean

  // Additional Info
  bankAccountNumber: string
  ifscCode: string

  // Officer fields (if applicable)
  officerNotes: string
  applicationId: string
}

export function UniversalApplicationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const schemeId = searchParams.get("scheme") || ""
  const isOfficerMode = searchParams.get("mode") === "officer"

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [scheme, setScheme] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    aadhaarNumber: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    fatherName: "",
    motherName: "",
    mobileNumber: "",
    district: "",
    taluk: "",
    village: "",
    caste: "",
    casteCategory: "",
    incomeCertificateNo: "",
    casteCertificateNo: "",
    uploadedDocuments: [],
    voiceConsent: false,
    documentReadiness: false,
    privacyConsent: false,
    bankAccountNumber: "",
    ifscCode: "",
    officerNotes: "",
    applicationId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isRecording, setIsRecording] = useState(false)

  const totalSteps = isOfficerMode ? 5 : 4
  const demoApi = DemoApiClient.getInstance()

  useEffect(() => {
    loadSchemeData()
  }, [schemeId])

  const loadSchemeData = async () => {
    try {
      const schemeData = await demoApi.getSchemeById(schemeId)
      setScheme(schemeData)

      if (isOfficerMode) {
        setFormData((prev) => ({
          ...prev,
          applicationId: `APP-${Date.now()}`,
        }))
      }
    } catch (error) {
      console.error("Failed to load scheme:", error)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleVoiceInput = async (field: keyof FormData) => {
    setIsRecording(true)
    try {
      // Simulate voice input
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock voice responses
      const mockVoiceResponses: Record<string, string> = {
        fullName: "John Doe",
        fatherName: "Robert Doe",
        motherName: "Mary Doe",
        district: "Demo District",
        village: "Demo Village",
      }

      if (mockVoiceResponses[field as string]) {
        handleInputChange(field, mockVoiceResponses[field as string])
      }
    } catch (error) {
      console.error("Voice input failed:", error)
    } finally {
      setIsRecording(false)
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Personal Information
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!formData.aadhaarNumber.trim()) newErrors.aadhaarNumber = "Aadhaar number is required"
        if (formData.aadhaarNumber.length !== 12) newErrors.aadhaarNumber = "Aadhaar must be 12 digits"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        if (!formData.gender) newErrors.gender = "Gender is required"
        break

      case 2: // Contact & Location
        if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required"
        if (formData.mobileNumber.length !== 10) newErrors.mobileNumber = "Mobile number must be 10 digits"
        if (!formData.district.trim()) newErrors.district = "District is required"
        break

      case 3: // Documents & Category
        if (!formData.caste) newErrors.caste = "Caste category is required"
        if (!formData.documentReadiness) newErrors.documentReadiness = "Please confirm document readiness"
        break

      case 4: // Consent & Bank Details
        if (!formData.privacyConsent) newErrors.privacyConsent = "Privacy consent is required"
        if (!formData.voiceConsent) newErrors.voiceConsent = "Voice consent is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      // Create application
      const application = await demoApi.createApplication(schemeId)

      // Log form submission
      await demoApi.logUserAction("application_submitted", {
        schemeId,
        applicationId: application.id,
        formData: { ...formData, aadhaarNumber: "****-****-" + formData.aadhaarNumber.slice(-4) },
      })

      // Redirect to success page
      router.push(`/citizen/application/${application.id}?success=true`)
    } catch (error) {
      console.error("Application submission failed:", error)
      setErrors({ submit: "Failed to submit application. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
              <p className="text-slate-400">Please provide your basic details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">
                  Full Name *
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleVoiceInput("fullName")}
                    disabled={isRecording}
                    className="border-slate-600"
                  >
                    <Mic className={`h-4 w-4 ${isRecording ? "text-red-400" : "text-slate-400"}`} />
                  </Button>
                </div>
                {errors.fullName && <p className="text-red-400 text-sm">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaarNumber" className="text-white">
                  Aadhaar Number *
                </Label>
                <Input
                  id="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleInputChange("aadhaarNumber", e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength={12}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                {errors.aadhaarNumber && <p className="text-red-400 text-sm">{errors.aadhaarNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-white">
                  Date of Birth *
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    handleInputChange("dateOfBirth", e.target.value)
                    // Auto-calculate age
                    if (e.target.value) {
                      const age = new Date().getFullYear() - new Date(e.target.value).getFullYear()
                      handleInputChange("age", age.toString())
                    }
                  }}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                {errors.dateOfBirth && <p className="text-red-400 text-sm">{errors.dateOfBirth}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-white">
                  Age
                </Label>
                <Input
                  id="age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Auto-calculated from DOB"
                  className="bg-slate-700 border-slate-600 text-white"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-400 text-sm">{errors.gender}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherName" className="text-white">
                  Father's Name
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange("fatherName", e.target.value)}
                    placeholder="Enter father's name"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleVoiceInput("fatherName")}
                    className="border-slate-600"
                  >
                    <Mic className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherName" className="text-white">
                  Mother's Name
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => handleInputChange("motherName", e.target.value)}
                    placeholder="Enter mother's name"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleVoiceInput("motherName")}
                    className="border-slate-600"
                  >
                    <Mic className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Contact & Location</h2>
              <p className="text-slate-400">Provide your contact and address details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-white">
                  Mobile Number *
                </Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                {errors.mobileNumber && <p className="text-red-400 text-sm">{errors.mobileNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district" className="text-white">
                  District *
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    placeholder="Enter your district"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleVoiceInput("district")}
                    className="border-slate-600"
                  >
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
                {errors.district && <p className="text-red-400 text-sm">{errors.district}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="taluk" className="text-white">
                  Taluk/Block
                </Label>
                <Input
                  id="taluk"
                  value={formData.taluk}
                  onChange={(e) => handleInputChange("taluk", e.target.value)}
                  placeholder="Enter your taluk/block"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="village" className="text-white">
                  Village/City
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) => handleInputChange("village", e.target.value)}
                    placeholder="Enter your village/city"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleVoiceInput("village")}
                    className="border-slate-600"
                  >
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber" className="text-white">
                  Bank Account Number
                </Label>
                <Input
                  id="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
                  placeholder="Enter bank account number"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifscCode" className="text-white">
                  IFSC Code
                </Label>
                <Input
                  id="ifscCode"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
                  placeholder="Enter IFSC code"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Category & Documents</h2>
              <p className="text-slate-400">Provide category details and upload documents</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Caste Category *</Label>
                <Select value={formData.caste} onValueChange={(value) => handleInputChange("caste", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select caste category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="obc">OBC</SelectItem>
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                    <SelectItem value="ews">EWS</SelectItem>
                  </SelectContent>
                </Select>
                {errors.caste && <p className="text-red-400 text-sm">{errors.caste}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="casteCertificateNo" className="text-white">
                  Caste Certificate Number
                </Label>
                <Input
                  id="casteCertificateNo"
                  value={formData.casteCertificateNo}
                  onChange={(e) => handleInputChange("casteCertificateNo", e.target.value)}
                  placeholder="Enter certificate number"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incomeCertificateNo" className="text-white">
                  Income Certificate Number
                </Label>
                <Input
                  id="incomeCertificateNo"
                  value={formData.incomeCertificateNo}
                  onChange={(e) => handleInputChange("incomeCertificateNo", e.target.value)}
                  placeholder="Enter income certificate number"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Required Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scheme?.required_documents?.map((doc: string, index: number) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">{doc}</span>
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documentReadiness"
                  checked={formData.documentReadiness}
                  onCheckedChange={(checked) => handleInputChange("documentReadiness", checked as boolean)}
                />
                <Label htmlFor="documentReadiness" className="text-white">
                  I confirm that I have all the required documents ready *
                </Label>
              </div>
              {errors.documentReadiness && <p className="text-red-400 text-sm">{errors.documentReadiness}</p>}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Consent & Confirmation</h2>
              <p className="text-slate-400">Please provide your consent to proceed</p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-slate-700/30 rounded-lg border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-4">Privacy & Terms</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacyConsent"
                      checked={formData.privacyConsent}
                      onCheckedChange={(checked) => handleInputChange("privacyConsent", checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="privacyConsent" className="text-white">
                        I agree to the privacy policy and terms of service *
                      </Label>
                      <p className="text-sm text-slate-400 mt-1">
                        Your data will be used only for processing this application and will be kept secure.
                      </p>
                    </div>
                  </div>
                  {errors.privacyConsent && <p className="text-red-400 text-sm">{errors.privacyConsent}</p>}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="voiceConsent"
                      checked={formData.voiceConsent}
                      onCheckedChange={(checked) => handleInputChange("voiceConsent", checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="voiceConsent" className="text-white">
                        I consent to voice-based interactions and recordings *
                      </Label>
                      <p className="text-sm text-slate-400 mt-1">
                        Voice recordings may be used for verification and assistance purposes.
                      </p>
                    </div>
                  </div>
                  {errors.voiceConsent && <p className="text-red-400 text-sm">{errors.voiceConsent}</p>}
                </div>
              </div>

              <div className="p-6 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Application Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Scheme:</span>
                    <p className="text-white font-medium">{scheme?.title}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Applicant:</span>
                    <p className="text-white font-medium">{formData.fullName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Mobile:</span>
                    <p className="text-white font-medium">{formData.mobileNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">District:</span>
                    <p className="text-white font-medium">{formData.district}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5: // Officer Mode Only
        return isOfficerMode ? (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Officer Review</h2>
              <p className="text-slate-400">Additional officer controls and notes</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="applicationId" className="text-white">
                  Application ID
                </Label>
                <Input
                  id="applicationId"
                  value={formData.applicationId}
                  className="bg-slate-700 border-slate-600 text-white"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="officerNotes" className="text-white">
                  Officer Notes
                </Label>
                <Textarea
                  id="officerNotes"
                  value={formData.officerNotes}
                  onChange={(e) => handleInputChange("officerNotes", e.target.value)}
                  placeholder="Add any notes or comments about this application..."
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/20">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validate Aadhaar
                </Button>
                <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/20">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Certificate
                </Button>
                <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500/20">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Raise Complaint
                </Button>
              </div>
            </div>
          </div>
        ) : null

      default:
        return null
    }
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-400 mx-auto mb-4" />
          <p className="text-white">Loading application form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {isOfficerMode ? "Officer Application Review" : "Apply for Scheme"}
                </h1>
                <p className="text-slate-400">{scheme.title}</p>
              </div>
            </div>
            <Badge variant="outline" className="border-teal-500 text-teal-400">
              {scheme.country} • {scheme.category}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-slate-400">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Form Content */}
        <Card className="bg-slate-800/50 border-slate-700 max-w-4xl mx-auto">
          <CardContent className="p-8">
            {renderStepContent()}

            {/* Error Display */}
            {errors.submit && (
              <Alert className="border-red-500/50 bg-red-500/10 mt-6">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-slate-600 text-slate-400"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-4">
                <Button variant="outline" className="border-slate-600 text-slate-400">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>

                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} className="bg-teal-500 hover:bg-teal-600">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading} className="bg-green-500 hover:bg-green-600">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
