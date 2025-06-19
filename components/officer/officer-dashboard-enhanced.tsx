"use client"

import { useRouter } from "next/navigation"
import { Clock, CheckCircle, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const OfficerDashboardEnhanced = () => {
  const router = useRouter()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4 text-slate-300">Officer Dashboard</h1>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-slate-300">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create New Task
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            View Pending Tasks
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Mark Task as Urgent
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-slate-300">Today's Stats</h2>

        {/* ✅ Clickable Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card
            className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 cursor-pointer transition-all"
            onClick={() => router.push("/officer/workspace/pending")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-orange-400">24</p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 cursor-pointer transition-all"
            onClick={() => router.push("/officer/workspace/completed")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completed Today</p>
                  <p className="text-2xl font-bold text-green-400">8</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all"
            onClick={() => router.push("/officer/workspace/total")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Processed</p>
                  <p className="text-2xl font-bold text-blue-400">156</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 cursor-pointer transition-all"
            onClick={() => router.push("/officer/workspace/analytics")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg. Time (hrs)</p>
                  <p className="text-2xl font-bold text-purple-400">2.5</p>
                </div>
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-slate-300">Recent Activity</h2>
        <ul className="list-disc list-inside text-slate-400">
          <li>Task #123 assigned to John Doe</li>
          <li>Task #124 marked as urgent by Jane Smith</li>
          <li>Task #125 completed by Michael Brown</li>
        </ul>
      </div>
    </div>
  )
}

export default OfficerDashboardEnhanced
