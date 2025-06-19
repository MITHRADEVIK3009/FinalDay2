"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Shield,
  Zap,
  Brain,
  Filter,
  Workflow,
  BarChart3,
  TrendingUp,
  X,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useDemo } from "@/contexts/DemoContext"
import { aiApiClient } from "@/lib/api-client-ai"
import { useRouter } from "next/navigation"

export function DocumentVerificationWorkspace() {
  const { t } = useTranslation()
  const { isDemoMode, demoOfficer } = useDemo()
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null)
  const router = useRouter()

  // ✅ Demo Documents for Verification
  const [documentsQueue] = useState([
    {
      id: "DOC-2024-001",
      filename: "income_certificate_muthu.pdf",
      applicant: "Muthu Selvam",
      applicationId: "APP-2024-001",
      documentType: "Income Certificate",
      uploadedAt: "2024-06-19T10:30:00Z",
      status: "pending",
      priority: "high",
      aiClassification: {
        type: "Income Certificate",
        confidence: 0.94,
        extractedData: {
          name: "Muthu Selvam",
          income: "₹2,50,000",
          issueDate: "2024-06-15",
          authority: "Tahsildar Office",
        },
      },
      verificationChecks: {
        format: "passed",
        signature: "pending",
        seal: "pending",
        data_consistency: "pending",
        blockchain_hash: "pending",
      },
    },
    {
      id: "DOC-2024-002",
      filename: "caste_certificate_priya.pdf",
      applicant: "Priya Sharma",
      applicationId: "APP-2024-002",
      documentType: "Caste Certificate",
      uploadedAt: "2024-06-19T09:15:00Z",
      status: "ai_verified",
      priority: "medium",
      aiClassification: {
        type: "Caste Certificate",
        confidence: 0.89,
        extractedData: {
          name: "Priya Sharma",
          caste: "OBC",
          issueDate: "2024-06-10",
          authority: "District Collector",
        },
      },
      verificationChecks: {
        format: "passed",
        signature: "passed",
        seal: "passed",
        data_consistency: "passed",
        blockchain_hash: "pending",
      },
    },
  ])

  // ✅ Status Board Data with Sample Data
  const [statusBoard] = useState({
    pending: 24,
    completedToday: 8,
    totalProcessed: 156,
    averageTime: "2.5",
    aiAccuracy: "94.2%",
  })

  // ✅ Sample Pending Applications
  const pendingApplications = [
    { id: 1, type: "Birth Certificate", submitted: "3 days ago", priority: "High", status: "Urgent" },
    { id: 2, type: "Income Certificate", submitted: "2 days ago", priority: "Medium", status: "Pending" },
    { id: 3, type: "Community Certificate", submitted: "1 day ago", priority: "Normal", status: "Pending" },
    { id: 4, type: "Widow Pension", submitted: "4 days ago", priority: "High", status: "Urgent" },
    { id: 5, type: "First Graduate Certificate", submitted: "today", priority: "Medium", status: "Pending" },
    { id: 6, type: "Domicile Certificate", submitted: "5 days ago", priority: "Normal", status: "Pending" },
    { id: 7, type: "Family Migration Certificate", submitted: "2 days ago", priority: "Medium", status: "Pending" },
    { id: 8, type: "OBC Certificate", submitted: "6 days ago", priority: "Normal", status: "Pending" },
    { id: 9, type: "Inter-Caste Marriage Certificate", submitted: "3 days ago", priority: "High", status: "Urgent" },
    { id: 10, type: "Birth Certificate", submitted: "today", priority: "Urgent", status: "Urgent" },
  ]

  // ✅ Sample Completed Today
  const completedToday = [
    { id: 1, type: "Community Certificate", status: "Approved", time: "10:34 AM" },
    { id: 2, type: "Birth Certificate", status: "Rejected", time: "11:12 AM" },
    { id: 3, type: "Widow Pension", status: "Approved", time: "12:01 PM" },
    { id: 4, type: "First Graduate Certificate", status: "Approved", time: "1:45 PM" },
    { id: 5, type: "Income Certificate", status: "Rejected", time: "2:17 PM" },
    { id: 6, type: "Domicile Certificate", status: "Approved", time: "3:40 PM" },
    { id: 7, type: "Death Certificate", status: "Approved", time: "4:10 PM" },
    { id: 8, type: "Marriage Certificate", status: "Approved", time: "5:08 PM" },
  ]

  // ✅ Sample Total Processed Summary
  const totalProcessedSummary = [
    { type: "Birth Certificates", count: 34 },
    { type: "Community Certificates", count: 28 },
    { type: "Income Certificates", count: 21 },
    { type: "Widow Pension", count: 18 },
    { type: "First Graduate", count: 16 },
    { type: "Caste Certificates", count: 14 },
    { type: "Domicile Certificates", count: 12 },
    { type: "Others", count: 13 },
  ]

  const handleDocumentSelect = (document: any) => {
    setSelectedDocument(document)
    setVerificationProgress(calculateProgress(document.verificationChecks))
  }

  const calculateProgress = (checks: any) => {
    const total = Object.keys(checks).length
    const passed = Object.values(checks).filter((status) => status === "passed").length
    return Math.round((passed / total) * 100)
  }

  const handleAIAnalysis = async (document: any) => {
    setAiAnalysisLoading(true)
    try {
      const response = await aiApiClient.analyzeDocument(
        document.documentType,
        `Document: ${document.filename}\nApplicant: ${document.applicant}`,
      )

      if (response.success) {
        console.log("AI Analysis:", response.data.analysis)
      }
    } catch (error) {
      console.error("AI Analysis failed:", error)
    } finally {
      setAiAnalysisLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "ai_verified":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "verified":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "flagged":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "ai_verified":
        return <Brain className="h-4 w-4" />
      case "verified":
        return <CheckCircle className="h-4 w-4" />
      case "flagged":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getCheckStatus = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-400" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "normal":
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  // ✅ Modal Component for Detailed Views
  const DetailModal = ({ type, onClose }: { type: string; onClose: () => void }) => {
    const getModalContent = () => {
      switch (type) {
        case "pending":
          return {
            title: `Pending Applications (${statusBoard.pending})`,
            subtitle: "Priority Queue - Sorted by Priority & Age",
            data: pendingApplications,
            renderItem: (item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">{item.type}</h4>
                  <p className="text-sm text-slate-400">Submitted {item.submitted}</p>
                </div>
                <Badge variant="secondary" className={getPriorityColor(item.priority)}>
                  {item.priority}
                </Badge>
              </div>
            ),
          }
        case "completed":
          return {
            title: `Completed Today (${statusBoard.completedToday})`,
            subtitle: "Applications processed today",
            data: completedToday,
            renderItem: (item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">{item.type}</h4>
                  <p className="text-sm text-slate-400">{item.time}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    item.status === "Approved"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ),
          }
        case "total":
          return {
            title: `Total Processed (${statusBoard.totalProcessed})`,
            subtitle: "Application Types Summary",
            data: totalProcessedSummary,
            renderItem: (item: any) => (
              <div key={item.type} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <h4 className="font-medium text-white">{item.type}</h4>
                <span className="text-blue-400 font-semibold">{item.count} processed</span>
              </div>
            ),
          }
        case "time":
          return {
            title: `Average Processing Time (${statusBoard.averageTime} hrs)`,
            subtitle: "Today's Processing Time Breakdown",
            data: [
              { type: "Birth Certificate", time: "3.2 hrs" },
              { type: "Income Certificate", time: "2.1 hrs" },
              { type: "Community Certificate", time: "2.7 hrs" },
              { type: "Widow Pension", time: "1.9 hrs" },
              { type: "First Graduate", time: "2.3 hrs" },
              { type: "Domicile", time: "2.6 hrs" },
              { type: "Death Certificate", time: "2.8 hrs" },
              { type: "Marriage Certificate", time: "1.9 hrs" },
            ],
            renderItem: (item: any) => (
              <div key={item.type} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <h4 className="font-medium text-white">{item.type}</h4>
                <span className="text-purple-400 font-semibold">{item.time}</span>
              </div>
            ),
          }
        default:
          return { title: "", subtitle: "", data: [], renderItem: () => null }
      }
    }

    const content = getModalContent()

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h2 className="text-xl font-bold text-white">{content.title}</h2>
              <p className="text-slate-400 text-sm">{content.subtitle}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-3">{content.data.map((item: any) => content.renderItem(item))}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* ✅ Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
                <Workflow className="h-8 w-8 text-blue-400" />
                <span>{t("officer.workspace")}</span>
                {isDemoMode && (
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    DEMO
                  </Badge>
                )}
              </h1>
              <p className="text-slate-400">
                {t("officer.document_verification")} • {demoOfficer?.name || "Officer"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="border-slate-600 text-slate-400">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-400">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* ✅ Clickable Status Board */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card
              className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 cursor-pointer transition-all"
              onClick={() => router.push("/officer/workspace/pending")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-orange-400">{statusBoard.pending}</p>
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
                    <p className="text-2xl font-bold text-green-400">{statusBoard.completedToday}</p>
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
                    <p className="text-2xl font-bold text-blue-400">{statusBoard.totalProcessed}</p>
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
                    <p className="text-2xl font-bold text-purple-400">{statusBoard.averageTime}</p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ✅ Main Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ✅ Document Queue */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Document Verification Queue</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Documents awaiting verification and review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documentsQueue.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedDocument?.id === doc.id
                            ? "bg-blue-500/10 border-blue-500/50"
                            : "bg-slate-700/30 border-slate-600 hover:border-slate-500"
                        }`}
                        onClick={() => handleDocumentSelect(doc)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(doc.status)}
                            <div>
                              <h3 className="font-semibold text-white">{doc.filename}</h3>
                              <p className="text-sm text-slate-400">
                                {doc.applicant} • {doc.documentType}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className={getStatusColor(doc.status)}>
                              {doc.status.replace("_", " ").toUpperCase()}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={
                                doc.priority === "high"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              }
                            >
                              {doc.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* ✅ AI Classification */}
                        <div className="mb-3 p-2 rounded bg-purple-500/10 border border-purple-500/30">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-purple-400">
                              AI Classification: {doc.aiClassification.type}
                            </span>
                            <span className="text-sm text-purple-300">
                              {Math.round(doc.aiClassification.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>

                        {/* ✅ Verification Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Verification Progress</span>
                            <span className="text-white">{calculateProgress(doc.verificationChecks)}%</span>
                          </div>
                          <Progress value={calculateProgress(doc.verificationChecks)} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-slate-400">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                          </span>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <Download className="h-3 w-3 mr-1" />
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

            {/* ✅ Verification Panel */}
            <div className="space-y-6">
              {selectedDocument ? (
                <>
                  {/* ✅ Document Details */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Document Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="text-slate-400 text-sm">Filename:</span>
                          <p className="text-white font-medium">{selectedDocument.filename}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Applicant:</span>
                          <p className="text-white font-medium">{selectedDocument.applicant}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Document Type:</span>
                          <p className="text-white font-medium">{selectedDocument.documentType}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Application ID:</span>
                          <p className="text-white font-medium">{selectedDocument.applicationId}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ✅ Verification Checks */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Verification Checks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(selectedDocument.verificationChecks).map(([check, status]) => (
                          <div key={check} className="flex items-center justify-between">
                            <span className="text-slate-300 capitalize">{check.replace("_", " ")}</span>
                            {getCheckStatus(status as string)}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Overall Progress</span>
                          <span className="text-white">{verificationProgress}%</span>
                        </div>
                        <Progress value={verificationProgress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* ✅ AI Analysis */}
                  <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Brain className="h-5 w-5" />
                        <span>AI Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="text-purple-200 text-sm">Extracted Data:</span>
                          <div className="mt-1 space-y-1">
                            {Object.entries(selectedDocument.aiClassification.extractedData).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-slate-300 capitalize">{key.replace("_", " ")}:</span>
                                <span className="text-white">{value as string}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAIAnalysis(selectedDocument)}
                          disabled={aiAnalysisLoading}
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                        >
                          {aiAnalysisLoading ? (
                            <>
                              <Brain className="h-4 w-4 mr-2 animate-pulse" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Run AI Analysis
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ✅ Actions */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Document
                        </Button>
                        <Button variant="outline" className="w-full border-red-500 text-red-400 hover:bg-red-500/20">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Flag for Review
                        </Button>
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                          <Shield className="h-4 w-4 mr-2" />
                          Verify Blockchain
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Select a Document</h3>
                    <p className="text-slate-400">Choose a document from the queue to begin verification</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Detail Modal */}
      {showDetailModal && <DetailModal type={showDetailModal} onClose={() => setShowDetailModal(null)} />}
    </div>
  )
}
