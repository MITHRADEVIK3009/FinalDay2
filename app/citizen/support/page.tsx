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
import { ArrowLeft, HelpCircle, Send, Phone, Mail, MessageCircle, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// ✅ Support Page with Question Form
export default function SupportPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    description: "",
    priority: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isDemoMode] = useState(() => localStorage.getItem("demo_mode") === "true")

  // ✅ Handle form submission
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
        const response = await fetch("/api/support/create-ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            userId: JSON.parse(localStorage.getItem("user_data") || "{}").id,
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

  // ✅ Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // ✅ Sample support tickets for demo
  const sampleTickets = [
    {
      id: "TICK-001",
      subject: "Unable to upload documents",
      status: "resolved",
      priority: "high",
      createdAt: "2024-06-15",
      category: "Technical Issue",
    },
    {
      id: "TICK-002",
      subject: "Application status inquiry",
      status: "in-progress",
      priority: "medium",
      createdAt: "2024-06-18",
      category: "Application Support",
    },
    {
      id: "TICK-003",
      subject: "Document verification delay",
      status: "open",
      priority: "low",
      createdAt: "2024-06-19",
      category: "Document Support",
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
              Thank you for contacting us. We've received your support request and will get back to you within 24 hours.
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ticket ID:</span>
                  <span className="text-white font-mono">TICK-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Priority:</span>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                    {formData.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Response:</span>
                  <span className="text-white">Within 24 hours</span>
                </div>
              </div>
            </div>
            <Button onClick={() => router.push("/citizen/dashboard")} className="bg-teal-500 hover:bg-teal-600">
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
              <Badge variant="outline" className="border-red-500 text-red-400">
                <HelpCircle className="h-3 w-3 mr-1" />
                Support Center
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
            <h1 className="text-3xl font-bold text-white mb-4">Support Center</h1>
            <p className="text-slate-400">Get help with government services, applications, and technical issues</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ✅ Ask a Question Form */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-red-400" />
                    <span>Ask a Question</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Fill out the form below and our support team will assist you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ✅ Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-white">
                          Category *
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="application">Application Support</SelectItem>
                            <SelectItem value="document">Document Support</SelectItem>
                            <SelectItem value="scheme">Scheme Information</SelectItem>
                            <SelectItem value="account">Account Issues</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-white">
                        Priority Level
                      </Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="low">Low - General inquiry</SelectItem>
                          <SelectItem value="medium">Medium - Standard support</SelectItem>
                          <SelectItem value="high">High - Urgent issue</SelectItem>
                          <SelectItem value="urgent">Urgent - Critical problem</SelectItem>
                        </SelectContent>
                      </Select>
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
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px]"
                        placeholder="Please provide detailed information about your issue..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !formData.name ||
                        !formData.email ||
                        !formData.category ||
                        !formData.subject ||
                        !formData.description
                      }
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
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
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-teal-400" />
                    <div>
                      <p className="text-white font-medium">Helpline</p>
                      <p className="text-slate-400 text-sm">1800-123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-teal-400" />
                    <div>
                      <p className="text-white font-medium">Email Support</p>
                      <p className="text-slate-400 text-sm">support@gov.in</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-teal-400" />
                    <div>
                      <p className="text-white font-medium">Support Hours</p>
                      <p className="text-slate-400 text-sm">Mon-Fri: 9 AM - 6 PM</p>
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

              {/* ✅ FAQ Quick Links */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      How to apply for schemes?
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      Document upload issues
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      Application status check
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                      Account login problems
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
