"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Settings,
  LogOut,
  TestTube,
  Shield,
  Building,
  User,
  MapPin,
  Mail,
  Phone,
  Award,
  Activity,
  TrendingUp,
  FileCheck,
  XCircle,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/DemoContext"
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher"

interface OfficerData {
  id: string
  name: string
  employeeId: string
  email: string
  phone: string
  department: string
  role: string
  designation: string
  district: string
  office: string
  isDemoOfficer?: boolean
  preferred_language: string
  status: string
}

export function OfficerDashboardEnhanced() {
  const router = useRouter()
  const { isDemoMode, demoOfficer, setDemoMode } = useDemo()
  const [officerData, setOfficerData] = useState<OfficerData | null>(null)
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState({
    pendingApplications: 24,
    completedToday: 8,
    totalProcessed: 156,
    averageProcessingTime: 2.5,
  })

  // Sample data for integrated dashboard
  const pendingApplications = [
    {
      id: 1,
      type: "Birth Certificate",
      applicant: "Rajesh Kumar",
      submitted: "3 days ago",
      priority: "Urgent",
      status: "Urgent",
      applicationId: "APP-2024-001",
    },
    {
      id: 2,
      type: "Income Certificate",
      applicant: "Priya Sharma",
      submitted: "2 days ago",
      priority: "Medium",
      status: "Pending",
      applicationId: "APP-2024-002",
    },
    {
      id: 3,
      type: "Community Certificate",
      applicant: "Muthu Selvam",
      submitted: "1 day ago",
      priority: "Normal",
      status: "Pending",
      applicationId: "APP-2024-003",
    },
    {
      id: 4,
      type: "Widow Pension",
      applicant: "Lakshmi Devi",
      submitted: "4 days ago",
      priority: "High",
      status: "Urgent",
      applicationId: "APP-2024-004",
    },
    {
      id: 5,
      type: "First Graduate Certificate",
      applicant: "Arun Kumar",
      submitted: "today",
      priority: "Medium",
      status: "Pending",
      applicationId: "APP-2024-005",
    },
  ]

  const completedToday = [
    {
      id: 1,
      type: "Community Certificate",
      applicant: "Ravi Kumar",
      status: "Approved",
      time: "10:34 AM",
      officer: "VAO Chennai",
      applicationId: "APP-2024-101",
    },
    {
      id: 2,
      type: "Birth Certificate",
      applicant: "Baby Priya",
      status: "Rejected",
      time: "11:12 AM",
      officer: "BDO Salem",
      applicationId: "APP-2024-102",
      reason: "Incomplete documents",
    },
    {
      id: 3,
      type: "Widow Pension",
      applicant: "Kamala Devi",
      status: "Approved",
      time: "12:01 PM",
      officer: "Tahsildar",
      applicationId: "APP-2024-103",
    },
    {
      id: 4,
      type: "First Graduate Certificate",
      applicant: "Arun Raj",
      status: "Approved",
      time: "1:45 PM",
      officer: "Education Officer",
      applicationId: "APP-2024-104",
    },
  ]

  const totalProcessedSummary = [
    { type: "Birth Certificates", count: 34, percentage: 22, trend: "+5", color: "text-blue-400" },
    { type: "Community Certificates", count: 28, percentage: 18, trend: "+3", color: "text-green-400" },
    { type: "Income Certificates", count: 21, percentage: 13, trend: "+2", color: "text-purple-400" },
    { type: "Widow Pension", count: 18, percentage: 12, trend: "+4", color: "text-orange-400" },
    { type: "First Graduate", count: 16, percentage: 10, trend: "+1", color: "text-teal-400" },
    { type: "Caste Certificates", count: 14, percentage: 9, trend: "+2", color: "text-pink-400" },
    { type: "Domicile Certificates", count: 12, percentage: 8, trend: "+1", color: "text-yellow-400" },
    { type: "Others", count: 13, percentage: 8, trend: "+3", color: "text-red-400" },
  ]

  const timeBreakdown = [
    { type: "Birth Certificate", time: "3.2 hrs", efficiency: 85, color: "text-blue-400" },
    { type: "Income Certificate", time: "2.1 hrs", efficiency: 95, color: "text-green-400" },
    { type: "Community Certificate", time: "2.7 hrs", efficiency: 88, color: "text-purple-400" },
    { type: "Widow Pension", time: "1.9 hrs", efficiency: 98, color: "text-teal-400" },
    { type: "First Graduate", time: "2.3 hrs", efficiency: 92, color: "text-orange-400" },
    { type: "Domicile", time: "2.6 hrs", efficiency: 89, color: "text-pink-400" },
    { type: "Death Certificate", time: "2.8 hrs", efficiency: 87, color: "text-yellow-400" },
    { type: "Marriage Certificate", time: "1.9 hrs", efficiency: 97, color: "text-red-400" },
  ]

  useEffect(() => {
    // Load officer data
    const savedOfficerData = localStorage.getItem("officer_data")
    if (savedOfficerData) {
      setOfficerData(JSON.parse(savedOfficerData))
    } else if (isDemoMode && demoOfficer) {
      setOfficerData(demoOfficer)
    }

    // Load demo notifications
    if (isDemoMode) {
      setNotifications([
        {
          id: 1,
          type: "urgent",
          title: "High Priority Application",
          message: "Birth certificate application requires immediate attention",
          time: "5 minutes ago",
        },
        {
          id: 2,
          type: "info",
          title: "System Update",
          message: "New document verification features available",
          time: "1 hour ago",
        },
        {
          id: 3,
          type: "success",
          title: "Monthly Target Achieved",
          message: "Congratulations! You've processed 95% of monthly applications",
          time: "2 hours ago",
        },
      ])
    }
  }, [isDemoMode, demoOfficer])

  const handleLogout = () => {
    localStorage.removeItem("officer_token")
    localStorage.removeItem("officer_data")
    localStorage.removeItem("demo_officer_token")
    localStorage.removeItem("demo_officer_data")
    if (isDemoMode) {
      setDemoMode(false)
    }
    router.push("/officer/login")
  }

  const handleExitDemo = () => {
    setDemoMode(false)
    localStorage.removeItem("demo_officer_token")
    localStorage.removeItem("demo_officer_data")
    router.push("/officer/login")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "normal":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Approved"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30"
  }

  const getStatusIcon = (status: string) => {
    return status === "Approved" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
  }

  if (!officerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading officer dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                <Building className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Officer Portal</h1>
                <p className="text-sm text-slate-400">{officerData.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              {isDemoMode && (
                <Button
                  onClick={handleExitDemo}
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Exit Demo
                </Button>
              )}
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-blue-600 border-b border-blue-500">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TestTube className="h-5 w-5 text-white" />
                <div>
                  <p className="text-white font-medium">Demo Mode Active</p>
                  <p className="text-blue-100 text-sm">You're viewing sample data for testing purposes</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Demo Data
              </Badge>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{officerData.name}</h3>
                    <p className="text-sm text-slate-400">{officerData.designation}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Shield className="h-4 w-4 text-slate-400" />
                    <span>{officerData.employeeId}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Building className="h-4 w-4 text-slate-400" />
                    <span>{officerData.role}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{officerData.district}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{officerData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{officerData.phone}</span>
                  </div>
                </div>
                {isDemoMode && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/20 text-blue-400 border-blue-500/30 w-full justify-center"
                  >
                    <TestTube className="h-3 w-3 mr-1" />
                    Demo Profile
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => router.push("/officer/workspace")}
                  className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Document Workspace
                </Button>
                <Button
                  onClick={() => router.push("/officer/forum")}
                  className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Officer Forum
                </Button>
                <Button
                  onClick={() => router.push("/officer/certificates")}
                  className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Generate Certificates
                </Button>
                <Button
                  onClick={() => router.push("/officer/settings")}
                  className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Pending</p>
                      <p className="text-2xl font-bold text-white">{stats.pendingApplications}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Completed Today</p>
                      <p className="text-2xl font-bold text-white">{stats.completedToday}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total Processed</p>
                      <p className="text-2xl font-bold text-white">{stats.totalProcessed}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Avg. Time (hrs)</p>
                      <p className="text-2xl font-bold text-white">{stats.averageProcessingTime}</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs with Integrated Content */}
            <Tabs defaultValue="dashboard" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
                <TabsTrigger value="dashboard" className="text-slate-400 data-[state=active]:text-white">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-slate-400 data-[state=active]:text-white">
                  Pending (24)
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-slate-400 data-[state=active]:text-white">
                  Completed (8)
                </TabsTrigger>
                <TabsTrigger value="processed" className="text-slate-400 data-[state=active]:text-white">
                  Total (156)
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-slate-400 data-[state=active]:text-white">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {isDemoMode ? (
                          <>
                            <div className="flex items-center space-x-3 p-2 rounded bg-slate-700/30">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <div className="flex-1">
                                <p className="text-sm text-white">Birth Certificate Approved</p>
                                <p className="text-xs text-slate-400">Application #BC001234</p>
                              </div>
                              <span className="text-xs text-slate-400">2 min ago</span>
                            </div>
                            <div className="flex items-center space-x-3 p-2 rounded bg-slate-700/30">
                              <Clock className="h-4 w-4 text-orange-400" />
                              <div className="flex-1">
                                <p className="text-sm text-white">Income Certificate Under Review</p>
                                <p className="text-xs text-slate-400">Application #IC005678</p>
                              </div>
                              <span className="text-xs text-slate-400">15 min ago</span>
                            </div>
                            <div className="flex items-center space-x-3 p-2 rounded bg-slate-700/30">
                              <AlertTriangle className="h-4 w-4 text-yellow-400" />
                              <div className="flex-1">
                                <p className="text-sm text-white">Document Verification Required</p>
                                <p className="text-xs text-slate-400">Application #CC009876</p>
                              </div>
                              <span className="text-xs text-slate-400">1 hour ago</span>
                            </div>
                          </>
                        ) : (
                          <p className="text-slate-400 text-center py-4">No recent activities</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Priority Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {isDemoMode ? (
                          <>
                            <div className="flex items-center justify-between p-3 rounded bg-red-500/10 border border-red-500/30">
                              <div>
                                <p className="text-sm font-medium text-white">Urgent: Birth Certificate</p>
                                <p className="text-xs text-slate-400">Submitted 3 days ago</p>
                              </div>
                              <Badge variant="destructive">High</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded bg-orange-500/10 border border-orange-500/30">
                              <div>
                                <p className="text-sm font-medium text-white">Income Certificate</p>
                                <p className="text-xs text-slate-400">Submitted 2 days ago</p>
                              </div>
                              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                                Medium
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded bg-blue-500/10 border border-blue-500/30">
                              <div>
                                <p className="text-sm font-medium text-white">Community Certificate</p>
                                <p className="text-xs text-slate-400">Submitted 1 day ago</p>
                              </div>
                              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                Normal
                              </Badge>
                            </div>
                          </>
                        ) : (
                          <p className="text-slate-400 text-center py-4">No priority applications</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Pending Applications Tab */}
              <TabsContent value="pending" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <Card className="bg-red-500/10 border-red-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-400">6</div>
                      <div className="text-sm text-red-300">Urgent</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-500/10 border-orange-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400">4</div>
                      <div className="text-sm text-orange-300">High Priority</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-500/10 border-yellow-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">8</div>
                      <div className="text-sm text-yellow-300">Medium Priority</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-500/10 border-green-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">6</div>
                      <div className="text-sm text-green-300">Normal Priority</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Applications Queue - Sorted by Priority & Age</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingApplications.map((app) => (
                        <div
                          key={app.id}
                          className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-blue-400" />
                              <div>
                                <h3 className="font-semibold text-white">{app.type}</h3>
                                <div className="flex items-center space-x-2 text-sm text-slate-400">
                                  <User className="h-3 w-3" />
                                  <span>{app.applicant}</span>
                                  <span>•</span>
                                  <span>{app.applicationId}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className={getPriorityColor(app.priority)}>
                                {app.priority === "Urgent" && <AlertTriangle className="h-3 w-3 mr-1" />}
                                {app.priority}
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-400">
                                {app.submitted}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-400">Submitted: {app.submitted}</div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                              >
                                Review
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500 text-green-400 hover:bg-green-500/20"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500/20"
                              >
                                Flag
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Completed Today Tab */}
              <TabsContent value="completed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card className="bg-green-500/10 border-green-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">6</div>
                      <div className="text-sm text-green-300">Approved</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-500/10 border-red-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-400">2</div>
                      <div className="text-sm text-red-300">Rejected</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">95%</div>
                      <div className="text-sm text-blue-300">Success Rate</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Today's Completed Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {completedToday.map((app) => (
                        <div key={app.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-blue-400" />
                              <div>
                                <h3 className="font-semibold text-white">{app.type}</h3>
                                <p className="text-sm text-slate-400">Applicant: {app.applicant}</p>
                                <p className="text-xs text-slate-500">{app.applicationId}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className={getStatusColor(app.status)}>
                                {getStatusIcon(app.status)}
                                <span className="ml-1">{app.status}</span>
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-400">
                                <Clock className="h-3 w-3 mr-1" />
                                {app.time}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-slate-400">
                              Processed by: <span className="text-slate-300">{app.officer}</span>
                              {app.reason && <span className="ml-4 text-red-400">Reason: {app.reason}</span>}
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                                View Details
                              </Button>
                              <Button size="sm" variant="outline" className="border-blue-500 text-blue-400">
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Total Processed Tab */}
              <TabsContent value="processed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">156</div>
                      <div className="text-sm text-blue-300">This Month</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-500/10 border-green-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">904</div>
                      <div className="text-sm text-green-300">Total (6 Months)</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-500/10 border-purple-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">151</div>
                      <div className="text-sm text-purple-300">Monthly Average</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Application Types Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {totalProcessedSummary.map((item) => (
                        <div key={item.type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FileText className={`h-4 w-4 ${item.color}`} />
                              <span className="text-white font-medium">{item.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-semibold ${item.color}`}>{item.count}</span>
                              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                                {item.trend}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={item.percentage} className="flex-1 h-2" />
                            <span className="text-xs text-slate-400 w-8">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Average Processing Time</span>
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">2.5 hrs</div>
                      <div className="text-sm text-blue-400">-0.3 hrs</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Fastest Processing</span>
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">1.9 hrs</div>
                      <div className="text-sm text-slate-400">Widow Pension</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Slowest Processing</span>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">3.2 hrs</div>
                      <div className="text-sm text-slate-400">Birth Certificate</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Overall Efficiency</span>
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">91.2%</div>
                      <div className="text-sm text-green-400">+2.1%</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Today's Processing Time Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {timeBreakdown.map((item) => (
                          <div key={item.type} className="p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{item.type}</span>
                              <div className="flex items-center space-x-2">
                                <span className={`font-semibold ${item.color}`}>{item.time}</span>
                                <Badge
                                  variant="secondary"
                                  className={
                                    item.efficiency >= 95
                                      ? "bg-green-500/20 text-green-400"
                                      : item.efficiency >= 90
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-orange-500/20 text-orange-400"
                                  }
                                >
                                  {item.efficiency}%
                                </Badge>
                              </div>
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  item.efficiency >= 95
                                    ? "bg-green-400"
                                    : item.efficiency >= 90
                                      ? "bg-yellow-400"
                                      : "bg-orange-400"
                                }`}
                                style={{ width: `${item.efficiency}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Analysis & Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Time Calculation */}
                      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <h4 className="text-purple-400 font-semibold mb-3 flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Time Calculation</span>
                        </h4>
                        <div className="text-purple-200 text-sm space-y-1">
                          <div>Total Time: 20.5 hrs</div>
                          <div>Applications: 8</div>
                          <div>Average: 20.5 ÷ 8 = 2.56 hrs</div>
                          <div className="font-semibold">Rounded: 2.5 hrs</div>
                        </div>
                      </div>

                      {/* Performance Insights */}
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h4 className="text-blue-400 font-semibold mb-3 flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>Performance Insights</span>
                        </h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                          <li>• Widow Pension applications are fastest (1.9 hrs)</li>
                          <li>• Birth certificates take longest (3.2 hrs)</li>
                          <li>• Overall efficiency improved by 2.1%</li>
                          <li>• 6 out of 8 types meet target time</li>
                        </ul>
                      </div>

                      {/* Recommendations */}
                      <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <h4 className="text-orange-400 font-semibold mb-3 flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Recommendations</span>
                        </h4>
                        <ul className="text-orange-200 text-sm space-y-1">
                          <li>• Optimize birth certificate verification process</li>
                          <li>• Consider AI pre-screening for common documents</li>
                          <li>• Implement batch processing for similar applications</li>
                          <li>• Review document templates for clarity</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
