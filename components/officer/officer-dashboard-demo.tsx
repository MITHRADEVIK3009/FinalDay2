"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Volume2,
  Eye,
  MessageCircle,
  Shield,
  Settings,
  Bell,
  Filter,
  Search,
  MoreHorizontal,
  TestTube,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/DemoContext"
import { useTranslation } from "react-i18next"
import { DemoModeToggle } from "@/components/common/DemoModeToggle"
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher"
import { llamaService } from "@/lib/llama-service"

export function OfficerDashboardDemo() {
  const router = useRouter()
  const { isDemoMode, demoOfficer } = useDemo()
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState("pending")
  const [dashboardStats, setDashboardStats] = useState({
    pending: 12,
    approved: 8,
    rejected: 3,
    totalHelped: 156,
  })

  // ✅ Demo Applications Data
  const [demoApplications] = useState([
    {
      id: "APP-2024-001",
      scheme_title: "Community Certificate",
      citizen_name: "Muthu Selvam",
      user_id: "USER-001",
      status: "pending",
      created_at: "2024-06-19T10:30:00Z",
      documents: [
        { id: "DOC-001", filename: "aadhaar_card.pdf", status: "pending" },
        { id: "DOC-002", filename: "address_proof.pdf", status: "pending" },
      ],
      priority: "Normal",
    },
    {
      id: "APP-2024-002",
      scheme_title: "Income Certificate",
      citizen_name: "Priya Sharma",
      user_id: "USER-002",
      status: "under-review",
      created_at: "2024-06-18T14:20:00Z",
      documents: [
        { id: "DOC-003", filename: "salary_slip.pdf", status: "verified" },
        { id: "DOC-004", filename: "bank_statement.pdf", status: "pending" },
      ],
      priority: "High",
    },
    {
      id: "APP-2024-003",
      scheme_title: "Caste Certificate",
      citizen_name: "Rajesh Kumar",
      user_id: "USER-003",
      status: "pending",
      created_at: "2024-06-17T09:15:00Z",
      documents: [
        { id: "DOC-005", filename: "birth_certificate.pdf", status: "pending" },
        { id: "DOC-006", filename: "school_certificate.pdf", status: "verified" },
      ],
      priority: "Normal",
    },
  ])

  // ✅ Demo Notifications
  const [demoNotifications] = useState([
    {
      id: "NOTIF-001",
      title: "New Application Assigned",
      message: "Community Certificate application from Muthu Selvam",
      type: "info",
      read: false,
      created_at: "2024-06-19T11:00:00Z",
    },
    {
      id: "NOTIF-002",
      title: "Document Verification Required",
      message: "Income Certificate - Bank statement needs review",
      type: "warning",
      read: false,
      created_at: "2024-06-19T10:45:00Z",
    },
    {
      id: "NOTIF-003",
      title: "Application Approved",
      message: "Caste Certificate for Rajesh Kumar approved successfully",
      type: "success",
      read: true,
      created_at: "2024-06-18T16:30:00Z",
    },
  ])

  const handleCreateDemoUser = () => {
    const demoCitizen = {
      id: "demo-citizen-001",
      name: "Muthu Selvam",
      phone: "+91 9876543210",
      aadhaar: "1234-5678-9012",
      preferred_language: "ta",
      district: "Chennai",
      village: "Anna Nagar",
      isDemoUser: true,
    }

    localStorage.setItem("demo_citizen_data", JSON.stringify(demoCitizen))
    alert("Demo citizen user created! You can now test citizen workflows by visiting the citizen portal.")
  }

  const handleGetDailySummary = async () => {
    try {
      const summary = await llamaService.generateOfficerSummary({
        name: demoOfficer?.name || "Demo Officer",
        department: demoOfficer?.department || "Demo Department",
        pendingCount: dashboardStats.pending,
        completedToday: dashboardStats.approved,
        priorityCases: 2,
      })

      // Convert to speech (you can implement TTS here)
      console.log("Daily Summary:", summary)
      alert(`Daily Summary: ${summary}`)
    } catch (error) {
      console.error("Failed to generate daily summary:", error)
    }
  }

  const navigateToReviewPanel = (application: any) => {
    router.push(`/officer/review/${application.id}`)
  }

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
      {/* ✅ Header with Demo Mode Toggle */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isDemoMode && (
                <Badge
                  variant="secondary"
                  className="bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse"
                >
                  <TestTube className="h-3 w-3 mr-1" />
                  {t("common.demo_mode")}
                </Badge>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">{t("navigation.dashboard")}</h1>
                <p className="text-slate-400">
                  {t("common.welcome")}, {demoOfficer?.name || "Officer"} - {demoOfficer?.role || "Role"} |{" "}
                  {demoOfficer?.department || "Department"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleGetDailySummary}
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                {t("officer.daily_summary")}
              </Button>
              <LanguageSwitcher />
              <DemoModeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-slate-400" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push("/officer/settings")}>
                <Settings className="h-5 w-5 text-slate-400" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-orange-500/20 border-b border-orange-500/30 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TestTube className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-orange-400 font-semibold">Demo Mode Active</p>
                  <p className="text-orange-300 text-sm">
                    You are logged in as: {demoOfficer?.name} ({demoOfficer?.role})
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/officer/login")}
                variant="outline"
                size="sm"
                className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
              >
                Exit Demo
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* ✅ Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t("dashboard.pending_applications")}</p>
                  <p className="text-2xl font-bold text-orange-400">{dashboardStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t("dashboard.approved_today")}</p>
                  <p className="text-2xl font-bold text-green-400">{dashboardStats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t("dashboard.rejected_today")}</p>
                  <p className="text-2xl font-bold text-red-400">{dashboardStats.rejected}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t("dashboard.citizens_helped")}</p>
                  <p className="text-2xl font-bold text-blue-400">{dashboardStats.totalHelped}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ✅ Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => router.push("/officer/ai-assistant")}
            variant="outline"
            className="h-20 flex flex-col items-center space-y-2 border-purple-500 text-purple-400 hover:bg-purple-500/20"
          >
            <MessageCircle className="h-6 w-6" />
            <span>{t("ai.ai_assistant")}</span>
          </Button>

          <Button
            onClick={() => router.push("/officer/forum-moderation")}
            variant="outline"
            className="h-20 flex flex-col items-center space-y-2 border-pink-500 text-pink-400 hover:bg-pink-500/20"
          >
            <Shield className="h-6 w-6" />
            <span>{t("officer.forum_moderation")}</span>
          </Button>

          <Button
            onClick={() => router.push("/officer/responsible-ai")}
            variant="outline"
            className="h-20 flex flex-col items-center space-y-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
          >
            <Shield className="h-6 w-6" />
            <span>{t("officer.ai_audit")}</span>
          </Button>

          <Button
            onClick={() => router.push("/officer/offline-queue")}
            variant="outline"
            className="h-20 flex flex-col items-center space-y-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
          >
            <FileText className="h-6 w-6" />
            <span>{t("officer.offline_queue")}</span>
          </Button>

          {isDemoMode && (
            <Button
              onClick={handleCreateDemoUser}
              variant="outline"
              className="h-20 flex flex-col items-center space-y-2 border-green-500 text-green-400 hover:bg-green-500/20"
            >
              <Users className="h-6 w-6" />
              <span>Create Demo User</span>
            </Button>
          )}
        </div>

        {/* ✅ Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="pending" className="data-[state=active]:bg-orange-500/20">
              {t("dashboard.pending_applications")}
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="data-[state=active]:bg-green-500/20">
              Recently Reviewed
            </TabsTrigger>
            <TabsTrigger value="escalated" className="data-[state=active]:bg-red-500/20">
              Escalated Cases
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">{t("dashboard.pending_applications")}</CardTitle>
                    <CardDescription className="text-slate-400">Applications waiting for your review</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Filter className="h-4 w-4 text-slate-400" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Search className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-slate-500 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-orange-400" />
                          <div>
                            <h3 className="font-semibold text-white">{app.scheme_title}</h3>
                            <p className="text-sm text-slate-400">
                              Citizen: {app.citizen_name} | ID: {app.user_id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={
                              app.priority === "High"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                            }
                          >
                            {app.priority}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-slate-400">
                          Submitted: {new Date(app.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-slate-400">Documents: {app.documents?.length || 0}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Users className="h-3 w-3 mr-1" />
                            {t("officer.citizen_history")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            {t("officer.assign_case")}
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/20"
                          >
                            {t("officer.escalate_case")}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigateToReviewPanel(app)}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content... */}
        </Tabs>
      </div>
    </div>
  )
}
