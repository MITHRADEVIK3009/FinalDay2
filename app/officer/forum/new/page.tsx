"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Shield,
  FileText,
  AlertTriangle,
  BookOpen,
  Users,
  MessageCircle,
  Plus,
  Tag,
  Send,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useDemo } from "@/contexts/DemoContext"

export default function NewOfficerDiscussion() {
  const router = useRouter()
  const { t } = useTranslation()
  const { isDemoMode, demoOfficer } = useDemo()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    priority: "medium",
    tags: "",
    isOfficial: false,
    department: demoOfficer?.department || "",
    attachments: [] as File[],
  })

  const categories = [
    { value: "policy-updates", label: "Policy Updates", icon: FileText, color: "text-blue-400" },
    { value: "technical-discussion", label: "Technical Discussion", icon: MessageCircle, color: "text-green-400" },
    { value: "training-materials", label: "Training Materials", icon: BookOpen, color: "text-purple-400" },
    { value: "department-discussions", label: "Department Discussions", icon: Users, color: "text-orange-400" },
    { value: "announcements", label: "Announcements", icon: Shield, color: "text-red-400" },
    { value: "best-practices", label: "Best Practices", icon: Plus, color: "text-teal-400" },
  ]

  const priorities = [
    { value: "low", label: "Low Priority", color: "text-green-400" },
    { value: "medium", label: "Medium Priority", color: "text-yellow-400" },
    { value: "high", label: "High Priority", color: "text-orange-400" },
    { value: "urgent", label: "Urgent", color: "text-red-400" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("New Discussion:", formData)
    router.push("/officer/forum")
    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forum
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                  <MessageCircle className="h-8 w-8 text-orange-400" />
                  <span>New Discussion</span>
                  {isDemoMode && (
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      DEMO
                    </Badge>
                  )}
                </h1>
                <p className="text-slate-400">Start a new discussion with fellow officers</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Discussion Title</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Enter a clear, descriptive title for your discussion..."
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Discussion Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Provide detailed information about your discussion topic. Include relevant context, questions, or information that would help other officers understand and contribute..."
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[200px]"
                      required
                    />
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Tag className="h-5 w-5" />
                      <span>Tags</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Add tags separated by commas (e.g., document-verification, AI, policy)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                    <p className="text-sm text-slate-400 mt-2">
                      Tags help other officers find and categorize your discussion
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="text-white">
                            <div className="flex items-center space-x-2">
                              <category.icon className={`h-4 w-4 ${category.color}`} />
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Priority Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value} className="text-white">
                            <span className={priority.color}>{priority.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Department</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Your department"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="official"
                        checked={formData.isOfficial}
                        onCheckedChange={(checked) => handleInputChange("isOfficial", checked)}
                      />
                      <Label htmlFor="official" className="text-white flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-400" />
                        <span>Official Post</span>
                      </Label>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      Mark as official if this is a policy update or announcement
                    </p>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title || !formData.content || !formData.category}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2 animate-pulse" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publish Discussion
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          <Card className="bg-blue-500/10 border-blue-500/30 mt-8">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Discussion Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-blue-200 space-y-2 text-sm">
                <li>• Keep discussions professional and relevant to government operations</li>
                <li>• Use clear, descriptive titles that help others understand the topic</li>
                <li>• Add relevant tags to help categorize and find discussions</li>
                <li>• Mark posts as "Official" only for policy updates and announcements</li>
                <li>• Be respectful and constructive in all interactions</li>
                <li>• Include relevant context and background information</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
