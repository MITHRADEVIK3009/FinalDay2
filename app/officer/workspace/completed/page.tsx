"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/DemoContext"

export default function CompletedTodayPage() {
  const router = useRouter()
  const { isDemoMode } = useDemo()

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
    {
      id: 5,
      type: "Income Certificate",
      applicant: "Suresh Babu",
      status: "Rejected",
      time: "2:17 PM",
      officer: "Revenue Officer",
      applicationId: "APP-2024-105",
      reason: "Income verification failed",
    },
    {
      id: 6,
      type: "Domicile Certificate",
      applicant: "Meera Nair",
      status: "Approved",
      time: "3:40 PM",
      officer: "District Collector",
      applicationId: "APP-2024-106",
    },
    {
      id: 7,
      type: "Death Certificate",
      applicant: "Krishnan Family",
      status: "Approved",
      time: "4:10 PM",
      officer: "Registrar",
      applicationId: "APP-2024-107",
    },
    {
      id: 8,
      type: "Marriage Certificate",
      applicant: "Raj & Deepa",
      status: "Approved",
      time: "5:08 PM",
      officer: "Sub Registrar",
      applicationId: "APP-2024-108",
    },
  ]

  const getStatusColor = (status: string) => {
    return status === "Approved"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30"
  }

  const getStatusIcon = (status: string) => {
    return status === "Approved" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
  }

  const approvedCount = completedToday.filter((app) => app.status === "Approved").length
  const rejectedCount = completedToday.filter((app) => app.status === "Rejected").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* ✅ Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workspace
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  <span>Completed Today</span>
                  {isDemoMode && (
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      DEMO
                    </Badge>
                  )}
                </h1>
                <p className="text-slate-400">8 applications processed today</p>
              </div>
            </div>
          </div>

          {/* ✅ Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{approvedCount}</div>
                <div className="text-sm text-green-300">Approved</div>
              </CardContent>
            </Card>
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{rejectedCount}</div>
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

          {/* ✅ Completed Applications */}
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
        </div>
      </div>
    </div>
  )
}
