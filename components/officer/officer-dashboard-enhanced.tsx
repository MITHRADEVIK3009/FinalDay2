"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/use-api"
import { getOfficerDashboard, voiceDailySummary, getCitizenHistory, assignCase, escalateCase } from "@/lib/api-client"

export function OfficerDashboardEnhanced() {
  const router = useRouter()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [selectedTab, setSelectedTab] = useState("pending")
  const [officerData, setOfficerData] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem("officer_data")
    if (stored) {
      setOfficerData(JSON.parse(stored))
    } else {
      router.push("/officer/login")
    }
  }, [router])

  const {
    data: dashboardData,
    loading: loadingDashboard,
    refetch: refetchDashboard,
  } = useApi(() => getOfficerDashboard(officerData?.id), [officerData?.id])

  const handleGetDailySummary = async () => {
    if (!officerData?.id) return
    const response = await voiceDailySummary(officerData.id)
    if (response.success && response.data) {
      const audio = new Audio(response.data.audioUrl)
      audio.play()
    }
  }

  const handleViewCitizenHistory = async (userId: string) => {
    const response = await getCitizenHistory(userId)
    if (response.success) {
      // Open citizen history modal or navigate to detailed view
      console.log("Citizen history:", response.data)
    }
  }

  const handleAssignCase = async (applicationId: string, officerId: string) => {
    const response = await assignCase(applicationId, officerId)
    if (response.success) {
      refetchDashboard()
    }
  }

  const handleEscalate = async (applicationId: string, reason: string) => {
    const response = await escalateCase(applicationId, reason)
    if (response.success) {
      refetchDashboard()
    }
  }

  const navigateToReviewPanel = (application: any) => {
    router.push(`/officer/review/${application.id}`)
  }

  const navigateToModPanel = () => {
    router.push("/officer/forum-moderation")
  }

  const navigateToNotifications = () => {
    router.push("/officer/notifications")
  }

  const navigateToAIAssistant = () => {
    router.push("/officer/ai-assistant")
  }

  if (!officerData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Officer Dashboard</h1>
              <p className="text-slate-400">
                Welcome, {officerData.name} - {officerData.role} | {officerData.department}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleGetDailySummary}
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Daily Summary
              </Button>
              <Button variant="ghost" size="icon" onClick={navigateToNotifications} className="relative">
                <Bell className="h-5 w-5 text-slate-400" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push("/officer/settings")}>
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
                  <p className="text-slate-400 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-400">{dashboardData?.stats?.pending || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Approved Today</p>
                  <p className="text-2xl font-bold text-green-400">{dashboardData?.stats?.approved || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Rejected Today</p>
                  <p className="text-2xl font-bold text-red-400">{dashboardData?.stats?.rejected || 0}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Citizens Helped</p>
                  <p className="text-2xl font-bold text-blue-400">{dashboardData?.stats?.totalHelped || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={navigateToAIAssistant}
            variant="outline"
            className="h-20 flex flex-col items-center space-y-2 border-purple-500 text-purple-400 hover:bg-purple-500/20"
          >
            <MessageCircle className="h-6 w-6" />
            <span>AI Assistant</span>
          </Button>

          <Button
            onClick={navigateToModPanel}
            variant="outline"
            className="h-20 flex flex-col items-center space-y-2 border-pink-500 text-pink-400 hover:bg-pink-500/20"
          >
            <Shield className="h-6 w-6" />
            <span>Forum Mod</span>
          </Button>

          <Button
            onClick={() => router.push("/officer/responsible-ai")}
            variant="outline"
            className="h-20 flex flex-col items-center space-y-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
          >
            <Shield className="h-6 w-6" />
            <span>AI Audit</span>
          </Button>

          <Button
            onClick={() => router.push("/officer/offline-queue")}
            variant="outline"
            className="h-20 flex flex-col items-center space-y-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
          >
            <FileText className="h-6 w-6" />
            <span>Offline Queue</span>
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="pending" className="data-[state=active]:bg-orange-500/20">
              Pending Applications
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
                    <CardTitle className="text-white">Pending Applications</CardTitle>
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
                {loadingDashboard ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-slate-700/30 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData?.pendingApplications?.map((app: any) => (
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
                              className="bg-orange-500/20 text-orange-400 border-orange-500/30"
                            >
                              {app.priority || "Normal"}
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
                              onClick={() => handleViewCitizenHistory(app.user_id)}
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              <Users className="h-3 w-3 mr-1" />
                              History
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAssignCase(app.id, "another-officer-id")}
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              Assign
                            </Button>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleEscalate(app.id, "Complex case requiring senior review")}
                              variant="outline"
                              className="border-red-500 text-red-400 hover:bg-red-500/20"
                            >
                              Escalate
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recently Reviewed Applications</CardTitle>
                <CardDescription className="text-slate-400">Your recent review activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Recent Reviews</h3>
                  <p className="text-slate-400">Your recently reviewed applications will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escalated" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Escalated Cases</CardTitle>
                <CardDescription className="text-slate-400">Cases requiring senior attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Escalated Cases</h3>
                  <p className="text-slate-400">Escalated cases will appear here for senior review</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Average Review Time</span>
                      <span className="text-white">2.5 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Approval Rate</span>
                      <span className="text-green-400">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cases This Week</span>
                      <span className="text-white">42</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Department Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Pending</span>
                      <span className="text-orange-400">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Processed Today</span>
                      <span className="text-blue-400">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Backlog</span>
                      <span className="text-red-400">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
