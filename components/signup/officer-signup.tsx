"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building, User, Shield, MapPin, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { createOfficer, hashAndSaveOfficerPassword } from "@/lib/api-client"

interface OfficerFormData {
  // Basic Information
  name: string
  email: string
  employeeId: string
  password: string
  confirmPassword: string

  // Role & Department
  role: string
  department: string
  designation: string

  // Location Assignment
  district: string
  block: string
  office: string

  // Additional Details
  phoneNumber: string
  joiningDate: string
  reportingOfficer: string

  // Permissions & Access
  permissions: string[]
  accessLevel: string

  // Consent
  termsAccepted: boolean
  codeOfConductAccepted: boolean
}

export function OfficerSignup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<OfficerFormData>({
    name: "",
    email: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    designation: "",
    district: "",
    block: "",
    office: "",
    phoneNumber: "",
    joiningDate: "",
    reportingOfficer: "",
    permissions: [],
    accessLevel: "",
    termsAccepted: false,
    codeOfConductAccepted: false,
  })

  const roles = [
    "Admin",
    "VAO (Village Administrative Officer)",
    "District Collector",
    "Block Development Officer",
    "Tahsildar",
    "Revenue Inspector",
    "Document Verifier",
    "Forum Moderator",
    "Senior Officer",
    "Clerk",
  ]

  const departments = [
    "Revenue Department",
    "Agriculture Department",
    "Health & Family Welfare",
    "Education Department",
    "Rural Development",
    "Social Welfare",
    "Transport Department",
    "Police Department",
    "Forest Department",
    "Public Works Department",
  ]

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
    "Tiruvannamalai",
    "Cuddalore",
    "Nagapattinam",
    "Karur",
    "Namakkal",
    "Perambalur",
  ]

  const accessLevels = [
    "Level 1 - Basic Access",
    "Level 2 - Document Review",
    "Level 3 - Application Approval",
    "Level 4 - Administrative",
    "Level 5 - Super Admin",
  ]

  const availablePermissions = [
    "review_documents",
    "approve_applications",
    "reject_applications",
    "moderate_forum",
    "escalate_cases",
    "assign_cases",
    "view_analytics",
    "manage_users",
    "system_admin",
    "ai_override",
  ]

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked ? [...prev.permissions, permission] : prev.permissions.filter((p) => p !== permission),
    }))
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    if (!formData.role || !formData.department || !formData.district) {
      setError("Please select role, department, and district")
      return false
    }

    if (!formData.termsAccepted || !formData.codeOfConductAccepted) {
      setError("Please accept the terms and code of conduct")
      return false
    }

    return true
  }

  const handleRegisterOfficer = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      // Hash password
      const hashedPassword = await hashAndSaveOfficerPassword(formData.password)

      const officerData = {
        name: formData.name,
        email: formData.email,
        employeeId: formData.employeeId,
        hashedPassword,
        role: formData.role,
        department: formData.department,
        designation: formData.designation,
        district: formData.district,
        block: formData.block,
        office: formData.office,
        phoneNumber: formData.phoneNumber,
        joiningDate: formData.joiningDate,
        reportingOfficer: formData.reportingOfficer,
        permissions: formData.permissions,
        accessLevel: formData.accessLevel,
        status: "pending_approval", // Requires admin approval
        createdAt: new Date().toISOString(),
      }

      const response = await createOfficer(officerData)

      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/officer/login")
        }, 3000)
      } else {
        setError(response.error || "Registration failed")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetFields = () => {
    setFormData({
      name: "",
      email: "",
      employeeId: "",
      password: "",
      confirmPassword: "",
      role: "",
      department: "",
      designation: "",
      district: "",
      block: "",
      office: "",
      phoneNumber: "",
      joiningDate: "",
      reportingOfficer: "",
      permissions: [],
      accessLevel: "",
      termsAccepted: false,
      codeOfConductAccepted: false,
    })
    setError("")
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
            <p className="text-slate-400 mb-4">
              Your officer account has been created and is pending approval from the administrator.
            </p>
            <p className="text-sm text-slate-500">You will be redirected to the login page shortly...</p>
          </CardContent>
        </Card>
      </div>
    )
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
              <h1 className="text-xl font-bold text-white">Officer Registration</h1>
              <p className="text-sm text-slate-400">Government of Tamil Nadu - Internal Portal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10 mb-6">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Enter your personal and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="email" className="text-white">
                    Official Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="officer@tn.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-white">
                    Employee ID
                  </Label>
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="EMP001234"
                    value={formData.employeeId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="+91 9876543210"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role & Department */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Role & Department</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Select your official role and department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">
                    Role *
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
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

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-white">
                    Department *
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
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
                  <Label htmlFor="designation" className="text-white">
                    Designation
                  </Label>
                  <Input
                    id="designation"
                    type="text"
                    placeholder="e.g., Senior Assistant"
                    value={formData.designation}
                    onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessLevel" className="text-white">
                    Access Level
                  </Label>
                  <Select
                    value={formData.accessLevel}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, accessLevel: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select Access Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {accessLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joiningDate" className="text-white">
                    Joining Date
                  </Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, joiningDate: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Assignment */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location Assignment</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Specify your assigned district and office</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="district" className="text-white">
                    Assigned District *
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
                  <Label htmlFor="office" className="text-white">
                    Office Location
                  </Label>
                  <Input
                    id="office"
                    type="text"
                    placeholder="e.g., Collectorate, VAO Office"
                    value={formData.office}
                    onChange={(e) => setFormData((prev) => ({ ...prev, office: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportingOfficer" className="text-white">
                    Reporting Officer
                  </Label>
                  <Input
                    id="reportingOfficer"
                    type="text"
                    placeholder="Name of reporting officer"
                    value={formData.reportingOfficer}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reportingOfficer: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Permissions & Consent */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Permissions & Consent</CardTitle>
                <CardDescription className="text-slate-400">Select permissions and accept terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-white">System Permissions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availablePermissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={formData.permissions.includes(permission)}
                          onCheckedChange={(checked) => handlePermissionChange(permission, !!checked)}
                        />
                        <Label htmlFor={permission} className="text-sm text-slate-300">
                          {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                  <h4 className="font-semibold text-white">Required Agreements</h4>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, termsAccepted: !!checked }))}
                    />
                    <Label htmlFor="terms" className="text-slate-300 text-sm leading-relaxed">
                      I accept the Terms of Service and Privacy Policy for the Tamil Nadu Digital Services Officer
                      Portal.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="conduct"
                      checked={formData.codeOfConductAccepted}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, codeOfConductAccepted: !!checked }))
                      }
                    />
                    <Label htmlFor="conduct" className="text-slate-300 text-sm leading-relaxed">
                      I agree to abide by the Government Code of Conduct and maintain confidentiality of citizen data.
                    </Label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleRegisterOfficer}
                    disabled={isLoading}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  >
                    {isLoading ? "Creating Account..." : "Register Officer"}
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    onClick={handleResetFields}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
