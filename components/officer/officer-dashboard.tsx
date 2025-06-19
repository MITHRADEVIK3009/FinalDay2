"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle, AlertCircle, Users, Volume2, Eye, MessageCircle, Shield } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { showPendingApplications, voiceDailySummary, verifyOrRejectDoc } from "@/lib/api-client"

interface OfficerDashboardProps {
  officerId: string
  language: string
}

export function OfficerDashboard({ officerId, language }: OfficerDashboardProps) {
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [dailySummaryAudio, setDailySummaryAudio] = useState<string>("")

  const {
    data: pendingApplications,
    loading: loadingApplications,
    refetch: refetchApplications,
  } = useApi(() => showPendingApplications(officerId), [officerId])

  const handleGetDailySummary = async () => {
    const response = await voiceDailySummary(officerId)
    if (response.success && response.data) {
      setDailySummaryAudio(response.data.audioUrl)
      // Auto-play the summary
      const audio = new Audio(response.data.audioUrl)
      audio.play()
    }
  }

  const handleDocumentReview = async (documentId: string, action: "verify" | "reject", reason?: string) => {
    const response = await verifyOrRejectDoc(documentId, action, reason)
    if (response.success) {
      refetchApplications()
      setSelectedApplication(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Officer Dashboard</h1>
              <p className="text-slate-400">Review and process citizen applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleGetDailySummary}
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500/20"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Daily Summary
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-400">{pendingApplications?.length || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Approved Today</p>
                  <p className="text-2xl font-bold text-green-400">24</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Rejected Today</p>
                  <p className="text-2xl font-bold text-red-400">3</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Citizens Helped</p>
                  <p className="text-2xl font-bold text-blue-400">156</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Applications */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Pending Applications</CardTitle>
                <CardDescription className="text-slate-400">Applications waiting for your review</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingApplications ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-slate-700/30 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApplications?.map((app: any) => (
                      <div
                        key={app.id}
                        className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-slate-500 cursor-pointer transition-all"
                        onClick={() => setSelectedApplication(app)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-orange-400" />
                            <div>
                              <h3 className="font-semibold text-white">{app.scheme_title}</h3>
                              <p className="text-sm text-slate-400">Citizen ID: {app.user_id}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            {app.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">
                            Submitted: {new Date(app.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-slate-400">Documents: {app.documents?.length || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Document Review Panel */}
          <div>
            {selectedApplication ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Document Review</CardTitle>
                  <CardDescription className="text-slate-400">
                    Review documents for {selectedApplication.scheme_title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedApplication.documents?.map((doc: any) => (
                    <div key={doc.id} className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{doc.filename}</span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleDocumentReview(doc.id, "verify")}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/20"
                          onClick={() => handleDocumentReview(doc.id, "reject", "Document unclear")}
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Select an Application</h3>
                  <p className="text-slate-400">Choose an application from the list to review documents</p>
                </CardContent>
              </Card>
            )}

            {/* AI Assistant for Officers */}
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>AI Assistant</span>
                </CardTitle>
                <CardDescription className="text-blue-200">Get help with document verification</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Ask AI About This Case
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Responsible AI Dashboard */}
            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>AI Transparency</span>
                </CardTitle>
                <CardDescription className="text-yellow-200">View AI decision explanations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/20">
                  View AI Audit Trail
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
