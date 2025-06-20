"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Search,
  MessageSquare,
  Bot,
  Bell,
  LogOut,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher"

export function CitizenDashboardEnhanced() {
  const { t } = useTranslation()
  const [applications] = useState([
    {
      id: "APP001",
      type: "Birth Certificate",
      status: "Under Review",
      submittedDate: "2024-01-15",
      progress: 60,
    },
    {
      id: "APP002",
      type: "Income Certificate",
      status: "Approved",
      submittedDate: "2024-01-10",
      progress: 100,
    },
    {
      id: "APP003",
      type: "Community Certificate",
      status: "Pending",
      submittedDate: "2024-01-20",
      progress: 30,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500"
      case "Under Review":
        return "bg-yellow-500"
      case "Pending":
        return "bg-orange-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4" />
      case "Under Review":
        return <Clock className="h-4 w-4" />
      case "Pending":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TN</span>
              </div>
              <div>
                <h1 className="text-white font-semibold">{t("citizen.portal_title")}</h1>
                <p className="text-slate-400 text-xs">{t("citizen.government_subtitle")}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
              {t("common.demo_mode")}
            </Badge>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Bell className="h-4 w-4 mr-2" />
              {t("citizen.notifications")}
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              {t("common.logout")}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">{t("citizen.welcome_message")}</h2>
          <p className="text-slate-400">{t("citizen.welcome_subtitle")}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t("citizen.stats.total_applications")}</p>
                  <p className="text-2xl font-bold text-blue-400">3</p>
                </div>
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t("citizen.stats.approved")}</p>
                  <p className="text-2xl font-bold text-green-400">1</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t("citizen.stats.pending")}</p>
                  <p className="text-2xl font-bold text-orange-400">2</p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{t("citizen.stats.avg_processing")}</p>
                  <p className="text-2xl font-bold text-purple-400">5d</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">{t("citizen.actions.apply_services")}</h3>
              <p className="text-slate-400 text-sm">{t("citizen.actions.apply_description")}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Search className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">{t("citizen.actions.scheme_finder")}</h3>
              <p className="text-slate-400 text-sm">{t("citizen.actions.scheme_description")}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Bot className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">{t("citizen.actions.ai_assistant")}</h3>
              <p className="text-slate-400 text-sm">{t("citizen.actions.ai_description")}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">{t("citizen.actions.community_forum")}</h3>
              <p className="text-slate-400 text-sm">{t("citizen.actions.forum_description")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{t("citizen.recent_applications")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${getStatusColor(app.status)}`}>{getStatusIcon(app.status)}</div>
                  <div>
                    <p className="text-white font-medium">{app.type}</p>
                    <p className="text-slate-400 text-sm">
                      {t("citizen.submitted")}: {app.submittedDate}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={app.progress} className="w-32 h-2" />
                      <span className="text-slate-400 text-xs">{app.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(app.status)} text-white`}>
                    {t(`citizen.status.${app.status.toLowerCase().replace(" ", "_")}`)}
                  </Badge>
                  <Button size="sm" variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {t("citizen.actions.view_details")}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CitizenDashboardEnhanced
