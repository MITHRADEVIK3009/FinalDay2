"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, TrendingUp, BarChart3, AlertTriangle, FileText, Flag, Eye, ThumbsUp } from "lucide-react"
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher"

interface Application {
  id: string
  type: string
  applicant: string
  submittedDate: string
  priority: "Urgent" | "High" | "Medium" | "Normal"
  status?: "Approved" | "Rejected"
  processedTime?: string
  processingTime?: number
}

const pendingApplications: Application[] = [
  {
    id: "BC001",
    type: "Birth Certificate",
    applicant: "Rajesh Kumar",
    submittedDate: "3 days ago",
    priority: "Urgent",
  },
  {
    id: "IC002",
    type: "Income Certificate",
    applicant: "Priya Sharma",
    submittedDate: "2 days ago",
    priority: "Medium",
  },
  {
    id: "CC003",
    type: "Community Certificate",
    applicant: "Arjun Patel",
    submittedDate: "1 day ago",
    priority: "Normal",
  },
  { id: "WP004", type: "Widow Pension", applicant: "Lakshmi Devi", submittedDate: "4 days ago", priority: "High" },
  {
    id: "FG005",
    type: "First Graduate Certificate",
    applicant: "Suresh Babu",
    submittedDate: "today",
    priority: "Medium",
  },
  {
    id: "DC006",
    type: "Domicile Certificate",
    applicant: "Meera Singh",
    submittedDate: "5 days ago",
    priority: "Normal",
  },
  {
    id: "FM007",
    type: "Family Migration Certificate",
    applicant: "Kiran Kumar",
    submittedDate: "2 days ago",
    priority: "Medium",
  },
  { id: "OBC008", type: "OBC Certificate", applicant: "Deepak Rao", submittedDate: "6 days ago", priority: "Normal" },
]

const completedApplications: Application[] = [
  {
    id: "CC101",
    type: "Community Certificate",
    applicant: "Ravi Kumar",
    submittedDate: "yesterday",
    priority: "Medium",
    status: "Approved",
    processedTime: "10:34 AM",
    processingTime: 2.7,
  },
  {
    id: "BC102",
    type: "Birth Certificate",
    applicant: "Sita Devi",
    submittedDate: "yesterday",
    priority: "High",
    status: "Rejected",
    processedTime: "11:12 AM",
    processingTime: 3.2,
  },
  {
    id: "WP103",
    type: "Widow Pension",
    applicant: "Kamala Bai",
    submittedDate: "yesterday",
    priority: "High",
    status: "Approved",
    processedTime: "12:01 PM",
    processingTime: 1.9,
  },
  {
    id: "FG104",
    type: "First Graduate Certificate",
    applicant: "Anil Sharma",
    submittedDate: "yesterday",
    priority: "Medium",
    status: "Approved",
    processedTime: "1:45 PM",
    processingTime: 2.3,
  },
]

const applicationTypes = [
  { type: "Birth Certificates", count: 34, percentage: 22 },
  { type: "Community Certificates", count: 28, percentage: 18 },
  { type: "Income Certificates", count: 21, percentage: 13 },
  { type: "Widow Pension", count: 18, percentage: 12 },
  { type: "First Graduate", count: 16, percentage: 10 },
  { type: "Caste Certificates", count: 14, percentage: 9 },
  { type: "Domicile Certificates", count: 12, percentage: 8 },
  { type: "Others", count: 13, percentage: 8 },
]

export function OfficerDashboardEnhanced() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("dashboard")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Normal":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Approved" ? "bg-green-500" : "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">OP</span>
              </div>
              <div>
                <h1 className="text-white font-semibold">{t("officer.portal_title")}</h1>
                <p className="text-slate-400 text-xs">{t("officer.department_subtitle")}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
              {t("common.demo_mode")}
            </Badge>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              {t("common.logout")}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card
              className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800/70 transition-colors"
              onClick={() => setActiveTab("pending")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{t("officer.stats.pending")}</p>
                    <p className="text-3xl font-bold text-orange-400">24</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800/70 transition-colors"
              onClick={() => setActiveTab("completed")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{t("officer.stats.completed_today")}</p>
                    <p className="text-3xl font-bold text-green-400">8</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800/70 transition-colors"
              onClick={() => setActiveTab("total")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{t("officer.stats.total_processed")}</p>
                    <p className="text-3xl font-bold text-blue-400">156</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800/70 transition-colors"
              onClick={() => setActiveTab("analytics")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{t("officer.stats.avg_time")}</p>
                    <p className="text-3xl font-bold text-purple-400">2.5</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-700">
              {t("officer.tabs.dashboard")}
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-slate-700">
              {t("officer.tabs.pending")} (24)
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-slate-700">
              {t("officer.tabs.completed")} (8)
            </TabsTrigger>
            <TabsTrigger value="total" className="data-[state=active]:bg-slate-700">
              {t("officer.tabs.total")} (156)
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
              {t("officer.tabs.analytics")}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{t("officer.recent_activities")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-white text-sm">{t("officer.activities.birth_certificate_approved")}</p>
                      <p className="text-slate-400 text-xs">2 {t("common.time.hours_ago")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-white text-sm">{t("officer.activities.income_certificate_review")}</p>
                      <p className="text-slate-400 text-xs">4 {t("common.time.hours_ago")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-white text-sm">{t("officer.activities.document_verification_required")}</p>
                      <p className="text-slate-400 text-xs">1 {t("common.time.hour_ago")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{t("officer.priority_queue")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingApplications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium">{app.type}</p>
                        <p className="text-slate-400 text-xs">{app.submittedDate}</p>
                      </div>
                      <Badge className={`${getPriorityColor(app.priority)} text-white`}>
                        {t(`officer.priority.${app.priority.toLowerCase()}`)}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {t("officer.pending_applications")} - {t("officer.priority_sorted")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{app.type}</p>
                        <p className="text-slate-400 text-sm">
                          {t("officer.applicant")}: {app.applicant}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {t("officer.submitted")}: {app.submittedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getPriorityColor(app.priority)} text-white`}>
                        {t(`officer.priority.${app.priority.toLowerCase()}`)}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          <Eye className="h-4 w-4 mr-1" />
                          {t("officer.actions.review")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {t("officer.actions.approve")}
                        </Button>
                        <Button size="sm" variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                          <Flag className="h-4 w-4 mr-1" />
                          {t("officer.actions.flag")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{t("officer.completed_today")}</CardTitle>
                <div className="flex space-x-4 text-sm">
                  <span className="text-green-400">6 {t("officer.approved")}</span>
                  <span className="text-red-400">2 {t("officer.rejected")}</span>
                  <span className="text-blue-400">95% {t("officer.success_rate")}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{app.type}</p>
                        <p className="text-slate-400 text-sm">
                          {t("officer.applicant")}: {app.applicant}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {t("officer.processed")}: {app.processedTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getStatusColor(app.status!)} text-white`}>
                        {t(`officer.status.${app.status!.toLowerCase()}`)}
                      </Badge>
                      <span className="text-slate-400 text-sm">{app.processingTime}h</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Total Tab */}
          <TabsContent value="total" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{t("officer.application_types_summary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicationTypes.map((type) => (
                  <div key={type.type} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white">{type.type}</span>
                      <span className="text-slate-400">
                        {type.count} ({type.percentage}%)
                      </span>
                    </div>
                    <Progress value={type.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{t("officer.processing_time_analytics")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">2.5h</p>
                    <p className="text-slate-400 text-sm">{t("officer.avg_processing_time")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">1.9h</p>
                    <p className="text-slate-400 text-sm">{t("officer.fastest_record")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-400">3.2h</p>
                    <p className="text-slate-400 text-sm">{t("officer.slowest_record")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">94.2%</p>
                    <p className="text-slate-400 text-sm">{t("officer.efficiency")}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-medium">{t("officer.todays_breakdown")}</h3>
                  {completedApplications.map((app) => (
                    <div key={app.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white">{app.type}</span>
                      <span className="text-slate-400">{app.processingTime}h</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default OfficerDashboardEnhanced
