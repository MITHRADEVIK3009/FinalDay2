"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Loader2,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client-enhanced"
import type { Application, Notification, Scheme } from "@/lib/supabase"

export function CitizenDashboardEnhanced() {
  const router = useRouter()

  // State Management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState({
    totalApplications: 0,
    approved: 0,
    underReview: 0,
    pending: 0,
    unreadNotifications: 0,
  })
  const [applications, setApplications] = useState<Application[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [recommendedSchemes, setRecommendedSchemes] = useState<Scheme[]>([])
  const [popularSchemes, setPopularSchemes] = useState<Scheme[]>([])

  // Initialize user and load data
  useEffect(() => {
    initializeDashboard()
  }, [])

  const initializeDashboard = async () => {
    try {
      setLoading(true)

      // Get user from localStorage or session
      const userData = localStorage.getItem("user_data")
      if (!userData) {
        router.push("/citizen/login")
        return
      }

      const user = JSON.parse(userData)
      apiClient.setUserId(user.id)

      // Load all dashboard data
      await Promise.all([loadDashboardStats(), loadApplications(), loadNotifications(), loadSchemes()])

      // Log dashboard view
      await apiClient.logUserAction("dashboard_view", { timestamp: new Date().toISOString() })
    } catch (err) {
      console.error("Dashboard initialization error:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardStats = async () => {
    try {
      const stats = await apiClient.getDashboardStats()
      setDashboardStats(stats)
    } catch (err) {
      console.error("Failed to load stats:", err)
    }
  }

  const loadApplications = async () => {
    try {
      const apps = await apiClient.getUserApplications()
      setApplications(apps.slice(0, 3)) // Show only recent 3
    } catch (err) {
      console.error("Failed to load applications:", err)
    }
  }

  const loadNotifications = async () => {
    try {
      const notifs = await apiClient.getUserNotifications()
      setNotifications(notifs)
    } catch (err) {
      console.error("Failed to load notifications:", err)
    }
  }

  const loadSchemes = async () => {
    try {
      const [recommended, popular] = await Promise.all([
        apiClient.getRecommendedSchemes(),
        apiClient.getPopularSchemes(),
      ])
      setRecommendedSchemes(recommended)
      setPopularSchemes(popular)
    } catch (err) {
      console.error("Failed to load schemes:", err)
    }
  }

  // Button Handlers with API Integration
  const handleQuickAction = async (action: string, route: string) => {
    await apiClient.logUserAction("quick_action_click", { action, route })
    router.push(route)
  }

  const handleSchemeApply = async (schemeId: string, schemeTitle: string) => {
    try {
      setLoading(true)
      const application = await apiClient.createApplication(schemeId)
      await apiClient.logUserAction("scheme_application_started", {
        schemeId,
        schemeTitle,
        applicationId: application.id,
      })

      // Refresh applications
      await loadApplications()
      await loadDashboardStats()

      router.push(`/citizen/application/${application.id}`)
    } catch (err) {
      console.error("Failed to apply for scheme:", err)
      setError("Failed to start application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.read) {
        await apiClient.markNotificationAsRead(notification.id)
        await loadNotifications()
        await loadDashboardStats()
      }

      await apiClient.logUserAction("notification_click", {
        notificationId: notification.id,
        type: notification.type,
      })
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const handleApplicationClick = async (application: Application) => {
    await apiClient.logUserAction("application_view", {
      applicationId: application.id,
      status: application.status,
    })
    router.push(`/citizen/application/${application.id}`)
  }

  const handleVideoClick = async (videoTitle: string, videoUrl: string) => {
    await apiClient.logUserAction("reference_video_click", {
      videoTitle,
      videoUrl,
    })
    window.open(videoUrl, "_blank")
  }

  const handleStartAIConversation = async () => {
    try {
      const sessionId = await apiClient.createAISession("dashboard_assistance")
      await apiClient.logUserAction("ai_session_started", { sessionId })
      router.push(`/citizen/ai-assistant?session=${sessionId}`)
    } catch (err) {
      console.error("Failed to start AI session:", err)
      router.push("/citizen/ai-assistant")
    }
  }

  const quickActions = [
    {
      icon: Search,
      label: "Find Schemes",
      color: "teal",
      route: "/citizen/scheme-finder",
      action: "find_schemes",
    },
    {
      icon: Upload,
      label: "Upload Documents",
      color: "blue",
      route: "/citizen/upload",
      action: "upload_documents",
    },
    {
      icon: MessageCircle,
      label: "AI Assistant",
      color: "purple",
      route: "/citizen/ai-assistant",
      action: "ai_assistant",
    },
    {
      icon: FileText,
      label: "My Certificates",
      color: "green",
      route: "/citizen/certificates",
      action: "my_certificates",
    },
    {
      icon: Users,
      label: "Community Forum",
      color: "orange",
      route: "/citizen/forum",
      action: "community_forum",
    },
    {
      icon: HelpCircle,
      label: "Support",
      color: "red",
      route: "/citizen/support",
      action: "support",
    },
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

  const referenceVideos = [
    {
      title: "USA - SNAP",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Ucna60ZmMbb0bo07SPKTcWoTxf61Ge.png",
      url: "https://www.youtube.com/watch?v=aD4dbMkDNO0",
    },
    {
      title: "India - PMAY",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZRqdILmey6wYESVrqupCx5lph5W9cI.png",
      url: "https://www.youtube.com/watch?v=XUdf3-6iApM",
    },
    {
      title: "China - Dibao",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-g1diL7EzePkAXuq2YTX1JeMcp9iCUx.png",
      url: "https://www.youtube.com/watch?v=skEx_GSTiAo",
    },
    {
      title: "France - RSA",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WujDEsc3cvffUNaaiDSjbFSvrM36JM.png",
      url: "https://www.youtube.com/watch?v=JIBvsAiV1kE",
    },
    {
      title: "Germany - Bürgergeld",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KiFnAqZC8bsjBc3t0arfhrzjtz2OvJ.png",
      url: "https://www.youtube.com/watch?v=7Alj5mie0OM",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-400 mx-auto mb-4" />
          <p className="text-white">Loading your dashboard...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, Citizen</h1>
              <p className="text-slate-400">Here's what's happening with your applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => handleQuickAction("notifications", "/citizen/notifications")}
              >
                <Bell className="h-5 w-5 text-slate-400" />
                {dashboardStats.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {dashboardStats.unreadNotifications}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleQuickAction("settings", "/citizen/settings")}>
                <Settings className="h-5 w-5 text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert className="border-red-500/50 bg-red-500/10 mb-6">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Applications</p>
                  <p className="text-2xl font-bold text-white">{dashboardStats.totalApplications}</p>
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
                  <p className="text-slate-400 text-sm">Under Review</p>
                  <p className="text-2xl font-bold text-yellow-400">{dashboardStats.underReview}</p>
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
                  <p className="text-2xl font-bold text-orange-400">{dashboardStats.pending}</p>
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
                        onClick={() => handleQuickAction(action.action, action.route)}
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
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No applications yet</p>
                      <Button
                        className="mt-4 bg-teal-500 hover:bg-teal-600"
                        onClick={() => handleQuickAction("find_schemes", "/citizen/scheme-finder")}
                      >
                        Find Schemes to Apply
                      </Button>
                    </div>
                  ) : (
                    applications.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 cursor-pointer hover:border-slate-500 transition-colors"
                        onClick={() => handleApplicationClick(app)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(app.status)}
                            <div>
                              <h3 className="font-semibold text-white">{app.schemes?.title || "Application"}</h3>
                              <p className="text-sm text-slate-400">
                                Applied on {new Date(app.created_at).toLocaleDateString()}
                              </p>
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
                    ))
                  )}
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
                  {notifications.length === 0 ? (
                    <p className="text-slate-400 text-sm">No new notifications</p>
                  ) : (
                    notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 rounded-lg bg-slate-700/30 cursor-pointer hover:bg-slate-700/50 transition-colors"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === "success"
                                ? "bg-green-400"
                                : notification.type === "warning"
                                  ? "bg-yellow-400"
                                  : notification.type === "error"
                                    ? "bg-red-400"
                                    : "bg-blue-400"
                            }`}
                          />
                          <div className="flex-1">
                            <p className={`text-sm ${notification.read ? "text-slate-400" : "text-white font-medium"}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                  onClick={handleStartAIConversation}
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
                {recommendedSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-yellow-500 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl">
                        {scheme.country === "USA"
                          ? "🇺🇸"
                          : scheme.country === "India"
                            ? "🇮🇳"
                            : scheme.country === "China"
                              ? "🇨🇳"
                              : scheme.country === "France"
                                ? "🇫🇷"
                                : "🇩🇪"}
                      </span>
                      <h3 className="font-semibold text-white">{scheme.title}</h3>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{scheme.description}</p>
                    <div className="space-y-1 text-xs text-slate-400 mb-3">
                      {scheme.required_documents?.slice(0, 3).map((doc, i) => (
                        <p key={i}>• {doc}</p>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                      onClick={() => handleSchemeApply(scheme.id, scheme.title)}
                    >
                      Apply Now
                    </Button>
                  </div>
                ))}
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
                {popularSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="bg-slate-700/30 rounded-lg p-3 border border-slate-600 hover:border-blue-500 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">
                        {scheme.country === "USA"
                          ? "🇺🇸"
                          : scheme.country === "India"
                            ? "🇮🇳"
                            : scheme.country === "China"
                              ? "🇨🇳"
                              : scheme.country === "France"
                                ? "🇫🇷"
                                : "🇩🇪"}
                      </span>
                      <h3 className="font-medium text-white text-sm">{scheme.title}</h3>
                    </div>
                    <p className="text-xs text-slate-300 mb-2">{scheme.description}</p>
                    <div className="space-y-1 text-xs text-slate-400 mb-2">
                      {scheme.required_documents?.slice(0, 2).map((doc, i) => (
                        <p key={i}>• {doc}</p>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs border-blue-500 text-blue-400 hover:bg-blue-500/20"
                      onClick={() => router.push(`/citizen/scheme/${scheme.id}`)}
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
                {referenceVideos.map((video, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => handleVideoClick(video.title, video.url)}
                  >
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={`${video.title} Tutorial`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <ExternalLink className="text-white h-5 w-5" />
                        </div>
                        <p className="text-white text-sm font-medium">{video.title}</p>
                      </div>
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
