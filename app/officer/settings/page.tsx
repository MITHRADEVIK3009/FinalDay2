"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, TestTube, Save, ArrowLeft, Building } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/DemoContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTranslation } from "react-i18next"
import { OfficerDemoToggle } from "@/components/officer/officer-demo-toggle"
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher"

export default function OfficerSettingsPage() {
  const router = useRouter()
  const { isDemoMode, demoOfficer } = useDemo()
  const { language } = useLanguage()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("profile")

  const [profileData, setProfileData] = useState({
    name: demoOfficer?.name || "Rajesh Kumar",
    email: demoOfficer?.email || "rajesh.kumar@tn.gov.in",
    phone: demoOfficer?.phone || "+91 9876543210",
    department: demoOfficer?.department || "Revenue Department",
    designation: demoOfficer?.designation || "District Collector",
    district: demoOfficer?.district || "Chennai",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
  })

  const handleSaveProfile = () => {
    // Save profile data
    console.log("Saving profile:", profileData)
    alert("Profile updated successfully!")
  }

  const handleSaveNotifications = () => {
    // Save notification settings
    console.log("Saving notifications:", notificationSettings)
    alert("Notification settings updated!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Building className="h-6 w-6 text-slate-900" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Officer Settings</h1>
                  <p className="text-sm text-slate-400">Manage your account and preferences</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isDemoMode && (
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  <TestTube className="h-3 w-3 mr-1" />
                  Demo Mode
                </Badge>
              )}
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500/20">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-500/20">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="demo" className="data-[state=active]:bg-green-500/20">
                <TestTube className="h-4 w-4 mr-2" />
                Demo Mode
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-red-500/20">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <User className="h-5 w-5 text-orange-400" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Update your personal and professional information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-white">
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, department: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation" className="text-white">
                        Designation
                      </Label>
                      <Input
                        id="designation"
                        value={profileData.designation}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, designation: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-white">
                        District
                      </Label>
                      <Input
                        id="district"
                        value={profileData.district}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, district: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Demo Mode Tab */}
            <TabsContent value="demo" className="space-y-6">
              <OfficerDemoToggle />
            </TabsContent>

            {/* Other tabs... */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
