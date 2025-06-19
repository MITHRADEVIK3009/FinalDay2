"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, FileText, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/DemoContext"

export default function TotalProcessedPage() {
  const router = useRouter()
  const { isDemoMode } = useDemo()

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

  const monthlyStats = [
    { month: "January", count: 142 },
    { month: "February", count: 138 },
    { month: "March", count: 156 },
    { month: "April", count: 149 },
    { month: "May", count: 163 },
    { month: "June", count: 156 },
  ]

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
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                  <span>Total Processed</span>
                  {isDemoMode && (
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      DEMO
                    </Badge>
                  )}
                </h1>
                <p className="text-slate-400">156 applications processed this month</p>
              </div>
            </div>
          </div>

          {/* ✅ Monthly Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ✅ Application Types Breakdown */}
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

            {/* ✅ Monthly Trends */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Monthly Processing Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats.map((stat, index) => (
                    <div key={stat.month} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-slate-300">{stat.month}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stat.count / 170) * 100}%` }}
                          />
                        </div>
                        <span className="text-blue-400 font-semibold w-8">{stat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ✅ Performance Insights */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2">Performance Insights</h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Peak processing in May (163 applications)</li>
                    <li>• Consistent performance across all months</li>
                    <li>• Birth certificates are the most common (22%)</li>
                    <li>• Overall processing efficiency: 94.2%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
