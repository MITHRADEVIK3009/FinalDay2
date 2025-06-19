"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, AlertTriangle, FileText, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/DemoContext"

export default function PendingApplicationsPage() {
  const router = useRouter()
  const { isDemoMode } = useDemo()

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
    {
      id: 6,
      type: "Domicile Certificate",
      applicant: "Meera Nair",
      submitted: "5 days ago",
      priority: "Normal",
      status: "Pending",
      applicationId: "APP-2024-006",
    },
    {
      id: 7,
      type: "Family Migration Certificate",
      applicant: "Suresh Babu",
      submitted: "2 days ago",
      priority: "Medium",
      status: "Pending",
      applicationId: "APP-2024-007",
    },
    {
      id: 8,
      type: "OBC Certificate",
      applicant: "Kavitha Reddy",
      submitted: "6 days ago",
      priority: "Normal",
      status: "Pending",
      applicationId: "APP-2024-008",
    },
    {
      id: 9,
      type: "Inter-Caste Marriage Certificate",
      applicant: "Ravi & Deepa",
      submitted: "3 days ago",
      priority: "High",
      status: "Urgent",
      applicationId: "APP-2024-009",
    },
    {
      id: 10,
      type: "Birth Certificate",
      applicant: "Baby Krishnan",
      submitted: "today",
      priority: "Urgent",
      status: "Urgent",
      applicationId: "APP-2024-010",
    },
  ]

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
                  <Clock className="h-8 w-8 text-orange-400" />
                  <span>Pending Applications</span>
                  {isDemoMode && (
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      DEMO
                    </Badge>
                  )}
                </h1>
                <p className="text-slate-400">24 applications awaiting review - Priority Queue</p>
              </div>
            </div>
          </div>

          {/* ✅ Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

          {/* ✅ Applications List */}
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
                        <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20">
                          Flag
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
