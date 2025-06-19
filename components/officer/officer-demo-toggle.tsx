"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TestTube, Info } from "lucide-react"
import { useDemo } from "@/contexts/DemoContext"
import { useTranslation } from "react-i18next"

export function OfficerDemoToggle() {
  const { isDemoMode, toggleDemoMode, demoOfficer } = useDemo()
  const { t } = useTranslation()
  const [showInfo, setShowInfo] = useState(false)

  const handleToggleDemo = () => {
    toggleDemoMode()
    if (!isDemoMode) {
      // Initialize demo officer data when enabling demo mode
      const demoOfficerData = {
        id: "demo-officer-001",
        name: "Rajesh Kumar",
        employeeId: "EMP001234",
        email: "rajesh.kumar@tn.gov.in",
        phone: "+91 9876543210",
        department: "Revenue Department",
        role: "Admin",
        designation: "District Collector",
        district: "Chennai",
        office: "Collectorate",
        isDemoOfficer: true,
        preferred_language: "en",
        status: "active",
      }
      localStorage.setItem("demo_officer_data", JSON.stringify(demoOfficerData))
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TestTube className="h-5 w-5 text-orange-400" />
              <CardTitle className="text-white">Demo Mode</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowInfo(!showInfo)}>
              <Info className="h-4 w-4 text-slate-400" />
            </Button>
          </div>
          <CardDescription className="text-slate-400">
            Enable demo mode for testing and training purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isDemoMode ? "bg-green-400" : "bg-slate-500"}`} />
              <span className="text-white">Demo Mode: {isDemoMode ? "Active" : "Inactive"}</span>
            </div>
            <Button
              onClick={handleToggleDemo}
              variant={isDemoMode ? "destructive" : "default"}
              className={isDemoMode ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"}
            >
              {isDemoMode ? "Disable Demo" : "Enable Demo"}
            </Button>
          </div>

          {isDemoMode && demoOfficer && (
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <div className="flex items-center space-x-2 mb-3">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                  Demo Officer Profile
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">Name:</p>
                  <p className="text-white font-medium">{demoOfficer.name}</p>
                </div>
                <div>
                  <p className="text-slate-400">Employee ID:</p>
                  <p className="text-white font-medium">{demoOfficer.employeeId}</p>
                </div>
                <div>
                  <p className="text-slate-400">Department:</p>
                  <p className="text-white font-medium">{demoOfficer.department}</p>
                </div>
                <div>
                  <p className="text-slate-400">Role:</p>
                  <p className="text-white font-medium">{demoOfficer.role}</p>
                </div>
              </div>
            </div>
          )}

          {showInfo && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <h4 className="text-blue-400 font-semibold mb-2">Demo Mode Features:</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Test all officer workflows safely</li>
                <li>• Access demo applications and documents</li>
                <li>• Practice document verification</li>
                <li>• Generate demo certificates</li>
                <li>• Use AI features with sample data</li>
                <li>• No real data is affected</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
