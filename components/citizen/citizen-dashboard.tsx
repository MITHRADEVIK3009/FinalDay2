"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Bell,
  FileText,
  Search,
  Upload,
  MessageCircle,
  Users,
  Settings,
  HelpCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function CitizenDashboard() {
  const router = useRouter()
  const [notifications] = useState([
    { id: 1, title: "Land Certificate Approved", type: "success", time: "2 hours ago" },
    { id: 2, title: "Document verification pending", type: "warning", time: "1 day ago" },
    { id: 3, title: "New scheme available for farmers", type: "info", time: "3 days ago" },
  ])

  const [applications] = useState([
    { id: 1, title: "Land Ownership Certificate", status: "approved", progress: 100, date: "2024-06-15" },
    { id: 2, title: "Income Certificate", status: "under-review", progress: 75, date: "2024-06-18" },
    { id: 3, title: "Caste Certificate", status: "pending", progress: 25, date: "2024-06-19" },
  ])

  const quickActions = [
    { icon: Search, label: "Find Schemes", color: "teal", route: "/citizen/scheme-finder" },
    { icon: Upload, label: "Upload Documents", color: "blue", route: "/citizen/upload" },
    { icon: MessageCircle, label: "AI Assistant", color: "purple", route: "/citizen/ai-assistant" },
    { icon: FileText, label: "My Certificates", color: "green", route: "/citizen/certificates" },
    { icon: Users, label: "Community Forum", color: "orange", route: "/citizen/forum" },
    { icon: HelpCircle, label: "Support", color: "red", route: "/citizen/support" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "under-review":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-orange-400" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "under-review":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, Citizen</h1>
              <p className="text-slate-400">Here's what's happening with your applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-slate-400" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push("/citizen/settings")}>
                <Settings className="h-5 w-5 text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Applications</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <FileText className="h-8 w-8 text-teal-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-400">8</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Under Review</p>
                  <p className="text-2xl font-bold text-yellow-400">3</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-orange-400">1</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-slate-400">Access frequently used services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-slate-700/50"
                        onClick={() => router.push(action.route)}
                      >
                        <div className={`p-3 rounded-lg bg-${action.color}-500/20`}>
                          <Icon className={`h-6 w-6 text-${action.color}-400`} />
                        </div>
                        <span className="text-sm text-white">{action.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Recent Applications</CardTitle>
                <CardDescription className="text-slate-400">Track your application status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(app.status)}
                          <div>
                            <h3 className="font-semibold text-white">{app.title}</h3>
                            <p className="text-sm text-slate-400">Applied on {app.date}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className={getStatusColor(app.status)}>
                          {app.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white">{app.progress}%</span>
                        </div>
                        <Progress value={app.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 rounded-lg bg-slate-700/30">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === "success"
                              ? "bg-green-400"
                              : notification.type === "warning"
                                ? "bg-yellow-400"
                                : "bg-blue-400"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-white">{notification.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant Quick Access */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>AI Assistant</span>
                </CardTitle>
                <CardDescription className="text-purple-200">Get instant help with your queries</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => router.push("/citizen/ai-assistant")}
                >
                  Start Conversation
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div>
                      <p className="text-sm text-white">Document verification</p>
                      <p className="text-xs text-slate-400">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-sm text-white">Scheme deadline</p>
                      <p className="text-xs text-slate-400">June 25, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Latest Schemes Recommended for You */}
        <div className="mt-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-xl">Latest Schemes Recommended for You</CardTitle>
              <CardDescription className="text-slate-400">
                Schemes that align with your profile and required documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Recommended Schemes - First 7 */}
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-yellow-500 transition-all cursor-pointer">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🇺🇸</span>
                    <h3 className="font-semibold text-white">SNAP</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Food assistance for low-income individuals and families</p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <p>• Proof of identity</p>
                    <p>• Social Security Number</p>
                    <p>• Proof of income</p>
                  </div>
                  <Button size="sm" className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                    Apply Now
                  </Button>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-yellow-500 transition-all cursor-pointer">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🇮🇳</span>
                    <h3 className="font-semibold text-white">PMAY</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Housing subsidy for economically weaker sections</p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <p>• Aadhaar card</p>
                    <p>• Income certificate</p>
                    <p>• Identity proof</p>
                  </div>
                  <Button size="sm" className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                    Apply Now
                  </Button>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-yellow-500 transition-all cursor-pointer">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🇨🇳</span>
                    <h3 className="font-semibold text-white">Dibao</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Minimum livelihood guarantee for low-income residents</p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <p>• Resident Identity Card</p>
                    <p>• Household registration</p>
                    <p>• Proof of family income</p>
                  </div>
                  <Button size="sm" className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                    Apply Now
                  </Button>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-yellow-500 transition-all cursor-pointer">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🇫🇷</span>
                    <h3 className="font-semibold text-white">RSA</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Income support for individuals with little or no income</p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <p>• National ID</p>
                    <p>• Proof of residence</p>
                    <p>• Income details</p>
                  </div>
                  <Button size="sm" className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                    Apply Now
                  </Button>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-yellow-500 transition-all cursor-pointer">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🇩🇪</span>
                    <h3 className="font-semibold text-white">Bürgergeld</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Basic income support for unemployed individuals</p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <p>• National ID</p>
                    <p>• Proof of address</p>
                    <p>• Bank statements</p>
                  </div>
                  <Button size="sm" className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                    Apply Now
                  </Button>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-yellow-500 transition-all cursor-pointer">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🇮🇳</span>
                    <h3 className="font-semibold text-white">PM-KISAN</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Direct income support of ₹6,000 per year to farmers</p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <p>• Land ownership documents</p>
                    <p>• Aadhaar card</p>
                    <p>• Bank account details</p>
                  </div>
                  <Button size="sm" className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                    Apply Now
                  </Button>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-yellow-500 transition-all cursor-pointer">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🇮🇳</span>
                    <h3 className="font-semibold text-white">Ayushman Bharat</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Health insurance coverage up to ₹5 lakh per family</p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <p>• Aadhaar card</p>
                    <p>• Income certificate</p>
                    <p>• Family composition proof</p>
                  </div>
                  <Button size="sm" className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Other Schemes */}
        <div className="mt-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-blue-400 text-xl">Popular Other Schemes</CardTitle>
              <CardDescription className="text-slate-400">
                Explore other government schemes from around the world
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Popular Schemes - Remaining 18 */}
                {[
                  {
                    country: "🇺🇸",
                    name: "Medicaid",
                    desc: "Free or low-cost health coverage",
                    docs: ["ID proof", "Income proof", "Residency proof"],
                  },
                  {
                    country: "🇺🇸",
                    name: "Section 8 Housing",
                    desc: "Rental assistance for low-income families",
                    docs: ["Income verification", "Family composition", "Citizenship proof"],
                  },
                  {
                    country: "🇺🇸",
                    name: "TANF",
                    desc: "Cash assistance for families with children",
                    docs: ["Birth certificates", "Income proof", "Social Security"],
                  },
                  {
                    country: "🇺🇸",
                    name: "Unemployment Insurance",
                    desc: "Temporary financial assistance for unemployed",
                    docs: ["Employment history", "ID proof", "Bank details"],
                  },
                  {
                    country: "🇮🇳",
                    name: "MGNREGA",
                    desc: "100 days guaranteed wage employment",
                    docs: ["Job card", "Bank account", "Address proof"],
                  },
                  {
                    country: "🇮🇳",
                    name: "Atal Pension Yojana",
                    desc: "Pension scheme for unorganized sector",
                    docs: ["Aadhaar", "Bank account", "Age proof"],
                  },
                  {
                    country: "🇨🇳",
                    name: "NRCMS",
                    desc: "Health insurance for rural residents",
                    docs: ["Rural registration", "ID card", "Medical records"],
                  },
                  {
                    country: "🇨🇳",
                    name: "Housing Provident Fund",
                    desc: "Savings scheme for housing purchase",
                    docs: ["Employment proof", "Salary certificate", "Bank account"],
                  },
                  {
                    country: "🇨🇳",
                    name: "Unemployment Insurance",
                    desc: "Monthly benefits for job loss",
                    docs: ["Employment history", "Termination certificate", "ID proof"],
                  },
                  {
                    country: "🇨🇳",
                    name: "Old-Age Pension",
                    desc: "Retirement benefits for senior citizens",
                    docs: ["Age certificate", "Contribution records", "Bank details"],
                  },
                  {
                    country: "🇫🇷",
                    name: "Pôle emploi",
                    desc: "Support and financial aid for job seekers",
                    docs: ["Work permit", "CV", "Termination letter"],
                  },
                  {
                    country: "🇫🇷",
                    name: "CMU-C",
                    desc: "Free complementary health insurance",
                    docs: ["Income proof", "Residency permit", "Tax documents"],
                  },
                  {
                    country: "🇫🇷",
                    name: "APL",
                    desc: "Housing allowance to help pay rent",
                    docs: ["Rental agreement", "Income proof", "Bank details"],
                  },
                  {
                    country: "🇫🇷",
                    name: "Prime d'activité",
                    desc: "Monthly supplement for low-income workers",
                    docs: ["Pay slips", "Tax returns", "Bank statements"],
                  },
                  {
                    country: "🇩🇪",
                    name: "Kindergeld",
                    desc: "Monthly allowance for children's costs",
                    docs: ["Birth certificate", "Tax ID", "Bank account"],
                  },
                  {
                    country: "🇩🇪",
                    name: "Elterngeld",
                    desc: "Financial support after childbirth",
                    docs: ["Birth certificate", "Income proof", "Employment status"],
                  },
                  {
                    country: "🇩🇪",
                    name: "BAföG",
                    desc: "Education grants for students",
                    docs: ["Enrollment certificate", "Income proof", "Academic records"],
                  },
                  {
                    country: "🇩🇪",
                    name: "Health Insurance",
                    desc: "Universal healthcare coverage",
                    docs: ["Residence permit", "Employment status", "Income proof"],
                  },
                ].map((scheme, index) => (
                  <div
                    key={index}
                    className="bg-slate-700/30 rounded-lg p-3 border border-slate-600 hover:border-blue-500 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{scheme.country}</span>
                      <h3 className="font-medium text-white text-sm">{scheme.name}</h3>
                    </div>
                    <p className="text-xs text-slate-300 mb-2">{scheme.desc}</p>
                    <div className="space-y-1 text-xs text-slate-400 mb-2">
                      {scheme.docs.slice(0, 2).map((doc, i) => (
                        <p key={i}>• {doc}</p>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-blue-500 text-blue-400 hover:bg-blue-500/20"
                    >
                      Learn More
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* For Reference - Video Tutorials */}
        <div className="mt-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-400 text-xl">For Reference</CardTitle>
              <CardDescription className="text-slate-400">
                Video tutorials and guides for international government schemes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="relative group cursor-pointer">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Ucna60ZmMbb0bo07SPKTcWoTxf61Ge.png"
                    alt="SNAP Application Tutorial"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-xl">▶</span>
                      </div>
                      <p className="text-white text-sm font-medium">USA - SNAP</p>
                    </div>
                  </div>
                </div>

                <div className="relative group cursor-pointer">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZRqdILmey6wYESVrqupCx5lph5W9cI.png"
                    alt="PMAY Application Guide"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-xl">▶</span>
                      </div>
                      <p className="text-white text-sm font-medium">India - PMAY</p>
                    </div>
                  </div>
                </div>

                <div className="relative group cursor-pointer">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-g1diL7EzePkAXuq2YTX1JeMcp9iCUx.png"
                    alt="China Dibao Guide"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-xl">▶</span>
                      </div>
                      <p className="text-white text-sm font-medium">China - Dibao</p>
                    </div>
                  </div>
                </div>

                <div className="relative group cursor-pointer">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WujDEsc3cvffUNaaiDSjbFSvrM36JM.png"
                    alt="France RSA Tutorial"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-xl">▶</span>
                      </div>
                      <p className="text-white text-sm font-medium">France - RSA</p>
                    </div>
                  </div>
                </div>

                <div className="relative group cursor-pointer">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KiFnAqZC8bsjBc3t0arfhrzjtz2OvJ.png"
                    alt="Germany Bürgergeld Guide"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-xl">▶</span>
                      </div>
                      <p className="text-white text-sm font-medium">Germany - Bürgergeld</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
