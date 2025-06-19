"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Download, Eye, Printer, CheckCircle, Stamp } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useDemo } from "@/contexts/DemoContext"

export function CertificateGeneration() {
  const { t } = useTranslation()
  const { isDemoMode, demoOfficer } = useDemo()
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [certificateData, setCertificateData] = useState({
    applicantName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    address: "",
    district: "",
    state: "Tamil Nadu",
    certificateType: "",
    issueDate: new Date().toISOString().split("T")[0],
    validUntil: "",
    serialNumber: "",
    qrCode: "",
    officerName: demoOfficer?.name || "",
    officerDesignation: demoOfficer?.role || "",
    department: demoOfficer?.department || "",
  })

  // ✅ Certificate Templates
  const [certificateTemplates] = useState([
    {
      id: "income_cert",
      name: "Income Certificate",
      description: "Certificate for income verification",
      fields: ["applicantName", "fatherName", "address", "income", "issueDate"],
      template: "income_template.pdf",
      preview: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "caste_cert",
      name: "Caste Certificate",
      description: "Certificate for caste verification",
      fields: ["applicantName", "fatherName", "motherName", "caste", "address"],
      template: "caste_template.pdf",
      preview: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "community_cert",
      name: "Community Certificate",
      description: "Certificate for community verification",
      fields: ["applicantName", "fatherName", "community", "address", "issueDate"],
      template: "community_template.pdf",
      preview: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "residence_cert",
      name: "Residence Certificate",
      description: "Certificate for residence verification",
      fields: ["applicantName", "fatherName", "address", "residencePeriod"],
      template: "residence_template.pdf",
      preview: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "nativity_cert",
      name: "Nativity Certificate",
      description: "Certificate for nativity verification",
      fields: ["applicantName", "fatherName", "birthPlace", "address"],
      template: "nativity_template.pdf",
      preview: "/placeholder.svg?height=400&width=300",
    },
  ])

  // ✅ Demo Applications Ready for Certificate Generation
  const [readyApplications] = useState([
    {
      id: "APP-2024-001",
      applicantName: "Muthu Selvam",
      fatherName: "Selvam Raman",
      motherName: "Kamala Selvam",
      certificateType: "Income Certificate",
      applicationDate: "2024-06-15",
      verificationStatus: "completed",
      documentsVerified: true,
      income: "₹2,50,000",
      address: "123 Anna Nagar, Chennai - 600040",
      district: "Chennai",
    },
    {
      id: "APP-2024-002",
      applicantName: "Priya Sharma",
      fatherName: "Raj Sharma",
      motherName: "Sunita Sharma",
      certificateType: "Caste Certificate",
      applicationDate: "2024-06-14",
      verificationStatus: "completed",
      documentsVerified: true,
      caste: "OBC",
      address: "456 T. Nagar, Chennai - 600017",
      district: "Chennai",
    },
    {
      id: "APP-2024-003",
      applicantName: "Rajesh Kumar",
      fatherName: "Suresh Kumar",
      motherName: "Meera Kumar",
      certificateType: "Community Certificate",
      applicationDate: "2024-06-13",
      verificationStatus: "completed",
      documentsVerified: true,
      community: "Hindu",
      address: "789 Adyar, Chennai - 600020",
      district: "Chennai",
    },
  ])

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = certificateTemplates.find((t) => t.id === templateId)
    if (template) {
      setCertificateData((prev) => ({
        ...prev,
        certificateType: template.name,
        serialNumber: generateSerialNumber(),
        qrCode: generateQRCode(),
      }))
    }
  }

  const handleApplicationSelect = (application: any) => {
    setCertificateData((prev) => ({
      ...prev,
      applicantName: application.applicantName,
      fatherName: application.fatherName,
      motherName: application.motherName,
      address: application.address,
      district: application.district,
      certificateType: application.certificateType,
      // Add specific fields based on certificate type
      ...(application.income && { income: application.income }),
      ...(application.caste && { caste: application.caste }),
      ...(application.community && { community: application.community }),
    }))

    // Auto-select template based on certificate type
    const template = certificateTemplates.find((t) => t.name === application.certificateType)
    if (template) {
      setSelectedTemplate(template.id)
    }
  }

  const generateSerialNumber = () => {
    const prefix = isDemoMode ? "DEMO" : "TN"
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    return `${prefix}/${year}/${random}`
  }

  const generateQRCode = () => {
    return `QR${Date.now()}`
  }

  const handleGenerateCertificate = () => {
    // In demo mode, show preview
    if (isDemoMode) {
      alert(
        `Demo Certificate Generated!\n\nType: ${certificateData.certificateType}\nApplicant: ${certificateData.applicantName}\nSerial: ${certificateData.serialNumber}\n\nNote: This is a demo certificate with "DEMO COPY" watermark.`,
      )
    } else {
      // In production, generate actual certificate
      console.log("Generating certificate:", certificateData)
    }
  }

  const selectedTemplateData = certificateTemplates.find((t) => t.id === selectedTemplate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* ✅ Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
              <Stamp className="h-8 w-8 text-green-400" />
              <span>{t("officer.certificate_generation")}</span>
              {isDemoMode && (
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  DEMO
                </Badge>
              )}
            </h1>
            <p className="text-slate-400">Generate official certificates after document verification</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ✅ Ready Applications */}
            <div>
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Ready for Certificate</CardTitle>
                  <CardDescription className="text-slate-400">Applications with completed verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {readyApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-3 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-green-500 cursor-pointer transition-colors"
                        onClick={() => handleApplicationSelect(app)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white text-sm">{app.applicantName}</h3>
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mb-1">{app.certificateType}</p>
                        <p className="text-xs text-slate-500">App ID: {app.id}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Template Selection */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{t("officer.template_selection")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {certificateTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedTemplate === template.id
                            ? "bg-blue-500/10 border-blue-500/50"
                            : "bg-slate-700/30 border-slate-600 hover:border-slate-500"
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-400" />
                          <div>
                            <h3 className="font-semibold text-white text-sm">{template.name}</h3>
                            <p className="text-xs text-slate-400">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ✅ Certificate Form */}
            <div>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Certificate Details</CardTitle>
                  <CardDescription className="text-slate-400">Fill in the certificate information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="applicantName" className="text-white">
                        Applicant Name *
                      </Label>
                      <Input
                        id="applicantName"
                        value={certificateData.applicantName}
                        onChange={(e) => setCertificateData((prev) => ({ ...prev, applicantName: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fatherName" className="text-white">
                        Father's Name *
                      </Label>
                      <Input
                        id="fatherName"
                        value={certificateData.fatherName}
                        onChange={(e) => setCertificateData((prev) => ({ ...prev, fatherName: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Enter father's name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">
                      Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={certificateData.address}
                      onChange={(e) => setCertificateData((prev) => ({ ...prev, address: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter complete address"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-white">
                        District
                      </Label>
                      <Input
                        id="district"
                        value={certificateData.district}
                        onChange={(e) => setCertificateData((prev) => ({ ...prev, district: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="District"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issueDate" className="text-white">
                        Issue Date
                      </Label>
                      <Input
                        id="issueDate"
                        type="date"
                        value={certificateData.issueDate}
                        onChange={(e) => setCertificateData((prev) => ({ ...prev, issueDate: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  {/* ✅ Dynamic fields based on certificate type */}
                  {selectedTemplateData?.id === "income_cert" && (
                    <div className="space-y-2">
                      <Label htmlFor="income" className="text-white">
                        Annual Income
                      </Label>
                      <Input
                        id="income"
                        value={certificateData.income || ""}
                        onChange={(e) => setCertificateData((prev) => ({ ...prev, income: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="₹ 2,50,000"
                      />
                    </div>
                  )}

                  {selectedTemplateData?.id === "caste_cert" && (
                    <div className="space-y-2">
                      <Label htmlFor="caste" className="text-white">
                        Caste
                      </Label>
                      <Select
                        value={certificateData.caste || ""}
                        onValueChange={(value) => setCertificateData((prev) => ({ ...prev, caste: value }))}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select caste" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="OBC">OBC</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="ST">ST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedTemplateData?.id === "community_cert" && (
                    <div className="space-y-2">
                      <Label htmlFor="community" className="text-white">
                        Community
                      </Label>
                      <Input
                        id="community"
                        value={certificateData.community || ""}
                        onChange={(e) => setCertificateData((prev) => ({ ...prev, community: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Hindu/Muslim/Christian/etc."
                      />
                    </div>
                  )}

                  {/* ✅ Officer Details */}
                  <div className="border-t border-slate-600 pt-4">
                    <h3 className="text-white font-semibold mb-3">Officer Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Officer Name</Label>
                        <Input
                          value={certificateData.officerName}
                          className="bg-slate-700 border-slate-600 text-white"
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Designation</Label>
                        <Input
                          value={certificateData.officerDesignation}
                          className="bg-slate-700 border-slate-600 text-white"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* ✅ Certificate Metadata */}
                  <div className="border-t border-slate-600 pt-4">
                    <h3 className="text-white font-semibold mb-3">Certificate Metadata</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Serial Number</Label>
                        <Input
                          value={certificateData.serialNumber}
                          className="bg-slate-700 border-slate-600 text-white"
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">QR Code</Label>
                        <Input
                          value={certificateData.qrCode}
                          className="bg-slate-700 border-slate-600 text-white"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ✅ Preview & Actions */}
            <div>
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Certificate Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTemplateData ? (
                    <div className="space-y-4">
                      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                        <img
                          src={selectedTemplateData.preview || "/placeholder.svg"}
                          alt="Certificate Preview"
                          className="w-full h-48 object-cover rounded"
                        />
                        {isDemoMode && (
                          <div className="mt-2 text-center">
                            <Badge
                              variant="secondary"
                              className="bg-orange-500/20 text-orange-400 border-orange-500/30"
                            >
                              DEMO COPY WATERMARK
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Template:</span>
                          <span className="text-white">{selectedTemplateData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Applicant:</span>
                          <span className="text-white">{certificateData.applicantName || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Serial:</span>
                          <span className="text-white">{certificateData.serialNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Issue Date:</span>
                          <span className="text-white">{certificateData.issueDate}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">Select a template to preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ✅ Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleGenerateCertificate}
                    disabled={!selectedTemplate || !certificateData.applicantName}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Stamp className="h-4 w-4 mr-2" />
                    {t("officer.generate_certificate")}
                  </Button>

                  <Button variant="outline" className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/20">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Certificate
                  </Button>

                  <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>

                  <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Certificate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
