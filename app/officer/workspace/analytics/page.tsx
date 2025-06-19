"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Zap, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/DemoContext"

export default function ProcessingTimeAnalyticsPage() {
  const router = useRouter()
  const { isDemoMode } = useDemo()

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

  const performanceMetrics = [
    { metric: "Average Processing Time", value: "2.5 hrs", change: "-0.3 hrs", trend: "down" },
    { metric: "Fastest Processing", value: "1.9 hrs", change: "Widow Pension", trend: "neutral" },
    { metric: "Slowest Processing", value: "3.2 hrs", change: "Birth Certificate", trend: "neutral" },
    { metric: "Overall Efficiency", value: "91.2%", change: "+2.1%", trend: "up" },
  ]

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-blue-400"
      default:
        return "text-slate-400"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />
      case "down":
        return <TrendingUp className="h-4 w-4 rotate-180" />
      default:
        return <Clock className="h-4 w-4" />
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
                  <Zap className="h-8 w-8 text-purple-400" />
                  <span>Processing Time Analytics</span>
                  {isDemoMode && (
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      DEMO
                    </Badge>
                  )}
                </h1>
                <p className="text-slate-400">Average processing time: 2.5 hours</p>
              </div>
            </div>
          </div>

          {/* ✅ Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">{metric.metric}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className={`text-sm ${getTrendColor(metric.trend)}`}>{metric.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ✅ Processing Time Breakdown */}
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

            {/* ✅ Time Analysis & Insights */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Analysis & Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ✅ Calculation Details */}
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

                {/* ✅ Performance Insights */}
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

                {/* ✅ Recommendations */}
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <h4 className="text-orange-400 font-semibold mb-3 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
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
        </div>
      </div>
    </div>
  )
}
