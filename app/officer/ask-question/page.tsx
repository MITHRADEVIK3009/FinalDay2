"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, HelpCircle, AlertTriangle, Phone, Mail, BookOpen, Users, CheckCircle, MessageSquare } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/DemoContext"

export default function OfficerAskQuestionPage() {
  const router = useRouter()
  const { isDemoMode } = useDemo()
  const [question, setQuestion] = useState("")
  const [category, setCategory] = useState("")
  const [urgency, setUrgency] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { value: "policy", label: "Policy Interpretation", icon: BookOpen },
    { value: "legal", label: "Legal Clarification", icon: AlertTriangle },
    { value: "procedure", label: "Procedure Guidance", icon: Users },
    { value: "technical", label: "Technical Support", icon: HelpCircle },
    { value: "compliance", label: "Compliance Issues", icon: CheckCircle },
    { value: "other", label: "Other", icon: MessageSquare },
  ]

  const urgencyLevels = [
    { value: "normal", label: "Normal", color: "bg-green-500/20 text-green-400", time: "24-48 hours" },
    { value: "urgent", label: "Urgent", color: "bg-yellow-500/20 text-yellow-400", time: "4-8 hours" },
    { value: "critical", label: "Critical", color: "bg-orange-500/20 text-orange-400", time: "1-2 hours" },
    { value: "emergency", label: "Emergency", color: "bg-red-500/20 text-red-400", time: "Immediate" },
  ]

  const recentQuestions = [
    {
      id: 1,
      question: "What is the procedure for inter-district transfer of applications?",
      category: "Procedure Guidance",
      status: "Answered",
      time: "2 days ago",
      expert: "Senior District Collector",
    },
    {
      id: 2,
      question: "Legal requirements for widow pension verification?",
      category: "Legal Clarification",
      status: "Pending",
      time: "1 day ago",
      expert: "Legal Advisor",
    },
    {
      id: 3,
      question: "New policy updates for caste certificate processing?",
      category: "Policy Interpretation",
      status: "Answered",
      time: "3 days ago",
      expert: "Policy Expert",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setQuestion("")
    setCategory("")
    setUrgency("")

    // Show success message or redirect
    alert("Question submitted successfully! You will receive a response based on the urgency level.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                  <HelpCircle className="h-8 w-8 text-blue-400" />
                  <span>Ask Expert Questions</span>
                  {isDemoMode && (
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      DEMO
                    </Badge>
                  )}
                </h1>
                <p className="text-slate-400">Get expert guidance from senior officers and policy experts</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Question Form */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Submit Your Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-slate-300">
                        Question Category
                      </Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {categories.map((cat) => {
                            const Icon = cat.icon
                            return (
                              {(
                                <SelectItem key={cat.value} value={cat.value} className="text-white">
                                  <>
                                    <Icon className="h-4 w-4" />
                                    <span className="ml-2">{cat.label}</span>
                                  </>
                                </SelectItem>
                              )}
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Urgency Level */}
                    <div className="space-y-2">
                      <Label htmlFor="urgency" className="text-slate-300">
                        Urgency Level
                      </Label>
                      <Select value={urgency} onValueChange={setUrgency}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {urgencyLevels.map((level) => (
                            {(
                              <SelectItem key={level.value} value={level.value} className="text-white">
                                <>
                                  <span>{level.label}</span>
                                  <Badge variant="secondary" className={`${level.color} ml-auto`}>
                                    {level.time}
                                  </Badge>
                                </>
                              </SelectItem>
                            )}
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Question Text */}
                    <div className="space-y-2">
                      <Label htmlFor="question" className="text-slate-300">
                        Your Question
                      </Label>
                      <Textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Describe your question in detail. Include relevant context, application types, or specific scenarios..."
                        className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting || !question || !category || !urgency}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin inline-block h-4 w-4 border-b-2 border-white rounded-full mr-2" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Submit Question
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Expert Contacts */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Expert Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Senior Officers</h4>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <Phone className="h-3 w-3" />
                      <span>+91-44-2567-8900</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <Mail className="h-3 w-3" />
                      <span>experts@tn.gov.in</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Expert Helpline</h4>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <Phone className="h-3 w-3" />
                      <span>1800-425-1234</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Available 24/7 for urgent queries</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Knowledge Base</h4>
                    <Button variant="outline" size="sm" className="w-full border-slate-600 text-slate-300">
                      <BookOpen className="h-3 w-3 mr-2" />
                      Browse FAQs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Response Times */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Expected Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {urgencyLevels.map((level) => (
                    <div key={level.value} className="flex items-center justify-between p-2 rounded">
                      <span className="text-slate-300">{level.label}</span>
                      <Badge variant="secondary" className={level.color}>
                        {level.time}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Questions */}
          <Card className="bg-slate-800/50 border-slate-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Your Recent Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQuestions.map((q) => (
                  <div key={q.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white">{q.question}</h4>
                      <Badge
                        variant="secondary"
                        className={
                          q.status === "Answered"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }
                      >
                        {q.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center space-x-4">
                        <span>{q.category}</span>
                        <span>•</span>
                        <span>{q.time}</span>
                      </div>
                      <span>Expert: {q.expert}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
