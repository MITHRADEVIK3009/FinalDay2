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
import { ArrowLeft, Shield, Send, Phone, Mail, Clock, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/DemoContext"

export default function OfficerAskQuestionPage() {
  const router = useRouter()
  const { isDemoMode, demoOfficer } = useDemo()
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    department: demoOfficer?.department || "",
    officerLevel: demoOfficer?.role || "",
    urgency: "normal",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // ✅ Officer-specific question categories
  const categories = [
    { value: "policy-interpretation", label: "Policy Interpretation & Guidelines" },
    { value: "legal-clarification", label: "Legal Clarification" },
    { value: "procedure-guidance", label: "Procedure & Process Guidance" },
    { value: "document-requirements", label: "Document Requirements" },
    { value: "inter-department", label: "Inter-Department Coordination" },
    { value: "citizen-rights", label: "Citizen Rights & Entitlements" },
    { value: "compliance-audit", label: "Compliance & Audit Questions" },
    { value: "technology-usage", label: "Technology & System Usage" },
    { value: "escalation-process", label: "Escalation Process" },
    { value: "training-development", label: "Training & Development" },
    { value: "best-practices", label: "Best Practices" },
    { value: "case-study", label: "Case Study Discussion" },
  ]

  const urgencyLevels = [
    { value: "normal", label: "Normal - General inquiry" },
    { value: "urgent", label: "Urgent - Need quick guidance" },
    { value: "critical", label: "Critical - Blocking citizen service" },
    { value: "emergency", label: "Emergency - Immediate response needed" },
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
        const response = await fetch("/api/officer/questions/submit", {
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
          throw new Error("Failed to submit question")
        }
      }
    } catch (error) {
      console.error("Question submission error:", error)
      alert("Failed to submit question. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // ✅ Sample officer questions
  const sampleQuestions = [
    {
      id: "OFF-Q-001",
      subject: "Income verification process for new guidelines",
      status: "answered",
      category: "Policy Interpretation",
      createdAt: "2024-06-15",
      answers: 3,
    },
    {
      id: "OFF-Q-002",
      subject: "Inter-caste marriage certificate requirements",
      status: "pending",
      category: "Document Requirements",
      createdAt: "2024-06-18",
      answers: 0,
    },
    {
      id: "OFF-Q-003",
      subject: "AI system accuracy concerns - escalation process",
      status: "in-discussion",
      category: "Technology Usage",
      createdAt: "2024-06-19",
      answers: 5,
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
            <h1 className="text-3xl font-bold text-white mb-4">Question Submitted Successfully!</h1>
            <p className="text-slate-400 mb-6">
              Your question has been submitted to the officer knowledge base. Senior officers and subject matter experts
              will provide guidance.
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Question ID:</span>
                  <span className="text-white font-mono">OFF-Q-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-white">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Urgency:</span>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                    {formData.urgency}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Response:</span>
                  <span className="text-white">
                    {formData.urgency === "emergency"
                      ? "Within 30 minutes"
                      : formData.urgency === "critical"
                        ? "Within 2 hours"
                        : formData.urgency === "urgent"
                          ? "Within 8 hours"
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
                <HelpCircle className="h-3 w-3 mr-1" />
                Ask Question
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
          {/* ✅ Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Officer Knowledge Center</h1>
            <p className="text-slate-400">
              Ask questions about policies, procedures, and get guidance from senior officers and experts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ✅ Question Form */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-orange-400" />
                    <span>Ask a Question</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Get expert guidance on policies, procedures, and operational questions
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
                          Question Category *
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select question category" />
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
                        <Label htmlFor="urgency" className="text-white">
                          Urgency Level *
                        </Label>
                        <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {urgencyLevels.map((urgency) => (
                              <SelectItem key={urgency.value} value={urgency.value}>
                                {urgency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">
                        Question Subject *
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        placeholder="Brief summary of your question"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">
                        Detailed Question *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px]"
                        placeholder="Please provide detailed context about your question, including specific scenarios, relevant policies, and what guidance you're seeking..."
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
                          Submit Question
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* ✅ Sidebar */}
            <div className="space-y-6">
              {/* ✅ Expert Contacts */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Expert Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">Senior Officers</p>
                      <p className="text-slate-400 text-sm">Policy & Legal Guidance</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">Expert Helpline</p>
                      <p className="text-slate-400 text-sm">1800-EXPERT (24/7)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">Knowledge Base</p>
                      <p className="text-slate-400 text-sm">knowledge@gov.in</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Your Recent Questions */}
              {isDemoMode && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Your Recent Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sampleQuestions.map((question) => (
                        <div key={question.id} className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium text-sm">{question.id}</span>
                            <Badge
                              variant="secondary"
                              className={
                                question.status === "answered"
                                  ? "bg-green-500/20 text-green-400"
                                  : question.status === "in-discussion"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-orange-500/20 text-orange-400"
                              }
                            >
                              {question.status}
                            </Badge>
                          </div>
                          <p className="text-slate-300 text-sm mb-1">{question.subject}</p>
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>{question.createdAt}</span>
                            <span>{question.answers} answers</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ✅ Popular Topics */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Popular Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      Income verification procedures
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      Document authentication process
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      Inter-department coordination
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      Citizen rights & entitlements
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* ✅ Emergency Guidance */}
              <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Emergency Guidance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-200 text-sm mb-3">
                    For urgent policy clarifications or citizen service emergencies
                  </p>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Emergency Consultation</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
