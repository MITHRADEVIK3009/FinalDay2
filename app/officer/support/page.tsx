"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Send, Phone, Mail, MessageCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/DemoContext"

export default function OfficerSupportPage() {
  const router = useRouter()
  const { isDemoMode, demoOfficer } = useDemo()
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    department: demoOfficer?.department || "",
    officerLevel: demoOfficer?.role || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // ✅ Officer-specific categories
  const categories = [
    { value: "policy-clarification", label: "Policy Clarification" },
    { value: "technical-support", label: "Technical Support" },
    { value: "system-access", label: "System Access Issues" },
    { value: "document-verification", label: "Document Verification" },
    { value: "ai-assistance", label: "AI System Issues" },
    { value: "training-request", label: "Training Request" },
    { value: "escalation", label: "Case Escalation" },
    { value: "inter-department", label: "Inter-Department Coordination" },
    { value: "citizen-complaint", label: "Citizen Complaint Handling" },
    { value: "other", label: "Other" },
  ]

  const priorities = [
    { value: "low", label: "Low - General inquiry" },
    { value: "medium", label: "Medium - Standard support" },
    { value: "high", label: "High - Urgent issue" },
    { value: "critical", label: "Critical - System down/blocking" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isDemoMode) {
        // ✅ Demo mode - simulate submission
        setTimeout(() => {
          setSubmitted(true)
          setIsSubmitting(false)
        }, 2000)
      } else {
        // ✅ Real API call
        const response = await fetch("/api/officer/support/create-ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            officerId: demoOfficer?.id,
            officerName: demoOfficer?.name,
          }),
        })

        if (response.ok) {
          setSubmitted(true)
        } else {
          throw new Error("Failed to submit support request")
        }
      }
    } catch (error) {
      console.error("Support submission error:", error)
      alert("Failed to submit support request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // ✅ Sample officer support tickets
  const sampleTickets = [
    {
      id: "OFF-TICK-001",
      subject: "AI document classification accuracy",
      status: "resolved",
      priority: "high",
      createdAt: "2024-06-15",
      category: "AI System Issues",
    },
    {
      id: "OFF-TICK-002",
      subject: "Policy clarification on new guidelines",
      status: "in-progress",
      priority: "medium",
      createdAt: "2024-06-18",
      category: "Policy Clarification",
    },
    {
      id: "OFF-TICK-003",
      subject: "System access for new officer",
      status: "open",
      priority: "high",
      createdAt: "2024-06-19",
      category: "System Access Issues",
    },
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Support Request Submitted!</h1>
            <p className="text-slate-400 mb-6">
              Your support request has been received and assigned to the appropriate team. You'll receive a response
              within 4 hours for high-priority issues.
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ticket ID:</span>
                  <span className="text-white font-mono">OFF-TICK-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Priority:</span>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                    {formData.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="text-white">{formData.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Response:</span>
                  <span className="text-white">
                    {formData.priority === "critical"
                      ? "Within 1 hour"
                      : formData.priority === "high"
                        ? "Within 4 hours"
                        : "Within 24 hours"}
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={() => router.push("/officer/dashboard")} className="bg-orange-500 hover:bg-orange-600">
              Return to Dashboard
            </Button>
          </div>
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
            <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-orange-500 text-orange-400">
                <Shield className="h-3 w-3 mr-1" />
                Officer Support
              </Badge>
              {isDemoMode && (
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  Demo Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* ✅ Support Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Officer Support Center</h1>
            <p className="text-slate-400">
              Get technical support, policy clarifications, and assistance with government operations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ✅ Support Request Form */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-orange-400" />
                    <span>Submit Support Request</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Describe your issue and our technical team will assist you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ✅ Officer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-white">
                          Department *
                        </Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => handleInputChange("department", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          placeholder="Your department"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="officerLevel" className="text-white">
                          Officer Level
                        </Label>
                        <Input
                          id="officerLevel"
                          value={formData.officerLevel}
                          onChange={(e) => handleInputChange("officerLevel", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          placeholder="e.g., VAO, BDO, Collector"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-white">
                          Issue Category *
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select issue category" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority" className="text-white">
                          Priority Level *
                        </Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => handleInputChange("priority", value)}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {priorities.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                {priority.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">
                        Detailed Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px]"
                        placeholder="Please provide detailed information about your issue, including steps to reproduce, error messages, and any relevant context..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !formData.subject ||
                        !formData.category ||
                        !formData.description ||
                        !formData.department
                      }
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Support Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* ✅ Sidebar */}
            <div className="space-y-6">
              {/* ✅ Contact Information */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Officer Support Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">Technical Helpdesk</p>
                      <p className="text-slate-400 text-sm">1800-OFFICER (24/7)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">Officer Support</p>
                      <p className="text-slate-400 text-sm">officer.support@gov.in</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">Response Times</p>
                      <p className="text-slate-400 text-sm">Critical: 1hr, High: 4hrs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Your Support Tickets */}
              {isDemoMode && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Your Recent Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sampleTickets.map((ticket) => (
                        <div key={ticket.id} className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium text-sm">{ticket.id}</span>
                            <Badge
                              variant="secondary"
                              className={
                                ticket.status === "resolved"
                                  ? "bg-green-500/20 text-green-400"
                                  : ticket.status === "in-progress"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-orange-500/20 text-orange-400"
                              }
                            >
                              {ticket.status}
                            </Badge>
                          </div>
                          <p className="text-slate-300 text-sm mb-1">{ticket.subject}</p>
                          <p className="text-slate-400 text-xs">{ticket.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ✅ Quick Help */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      System access issues
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      Document verification help
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      AI system troubleshooting
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      Policy clarifications
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Emergency Escalation */}
              <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Emergency Escalation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-200 text-sm mb-3">
                    For critical system failures or urgent citizen service disruptions
                  </p>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Emergency Escalation</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
