"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Shield,
  MessageCircle,
  Clock,
  User,
  FileText,
  Mic,
  Volume2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/use-api"
import { useVoice } from "@/hooks/use-voice"
import {
  getApplicationDetails,
  reviewDocument,
  getDocumentDetails,
  checkDocBlockchainHash,
  notifyCitizen,
} from "@/lib/api-client"

interface DocumentReviewPanelProps {
  applicationId: string
}

export function DocumentReviewPanel({ applicationId }: DocumentReviewPanelProps) {
  const router = useRouter()
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | "">("")
  const [reviewComment, setReviewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isRecording, transcript, startRecording, stopRecording, speakText } = useVoice()

  const {
    data: applicationData,
    loading: loadingApplication,
    refetch: refetchApplication,
  } = useApi(() => getApplicationDetails(applicationId), [applicationId])

  const handleDocumentReview = async (documentId: string, action: "approve" | "reject", comment: string) => {
    setIsSubmitting(true)
    try {
      const response = await reviewDocument(documentId, action, comment)
      if (response.success) {
        // Notify citizen about the review
        await notifyCitizen(applicationData.user_id, `Document ${action}d`, comment)
        refetchApplication()
        setReviewAction("")
        setReviewComment("")
        setSelectedDocument(null)
      }
    } catch (error) {
      console.error("Review failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewDocument = async (documentId: string) => {
    const response = await getDocumentDetails(documentId)
    if (response.success) {
      setSelectedDocument(response.data)
    }
  }

  const handleCheckBlockchain = async (documentId: string) => {
    const response = await checkDocBlockchainHash(documentId)
    if (response.success) {
      await speakText(`Document blockchain verification: ${response.data.verified ? "Verified" : "Not verified"}`)
    }
  }

  const handleVoiceComment = () => {
    if (transcript) {
      setReviewComment(transcript)
    }
  }

  useEffect(() => {
    handleVoiceComment()
  }, [transcript])

  if (loadingApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading application details...</div>
      </div>
    )
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
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Document Review Panel</h1>
                <p className="text-slate-400">Application ID: {applicationId}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Citizen Information */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Citizen Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Name</p>
                    <p className="text-white">{applicationData?.citizen_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="text-white">{applicationData?.citizen_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Aadhaar</p>
                    <p className="text-white">****-****-{applicationData?.citizen_aadhaar?.slice(-4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Application Date</p>
                    <p className="text-white">{new Date(applicationData?.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheme Details */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Scheme Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-white">{applicationData?.scheme_title}</h3>
                    <p className="text-slate-400">{applicationData?.scheme_description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {applicationData?.scheme_department}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                      {applicationData?.scheme_category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Submitted Documents</CardTitle>
                <CardDescription className="text-slate-400">Review each document for verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationData?.documents?.map((doc: any) => (
                    <div key={doc.id} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <div>
                            <h4 className="font-semibold text-white">{doc.filename}</h4>
                            <p className="text-sm text-slate-400">
                              Type: {doc.type} | Size: {doc.size} | Uploaded:{" "}
                              {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            doc.status === "verified"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : doc.status === "rejected"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>

                      {/* AI Classification Results */}
                      {doc.ai_classification && (
                        <div className="mb-3 p-2 rounded bg-purple-500/10 border border-purple-500/30">
                          <p className="text-sm text-purple-400">
                            AI Classification: {doc.ai_classification.type} (
                            {Math.round(doc.ai_classification.confidence * 100)}% confidence)
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDocument(doc.id)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckBlockchain(doc.id)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Verify Hash
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedDocument(doc)
                              setReviewAction("approve")
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedDocument(doc)
                              setReviewAction("reject")
                            }}
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/20"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Panel Sidebar */}
          <div className="space-y-6">
            {/* Review Action Panel */}
            {reviewAction && selectedDocument && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {reviewAction === "approve" ? "Approve Document" : "Reject Document"}
                  </CardTitle>
                  <CardDescription className="text-slate-400">{selectedDocument.filename}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comment" className="text-white">
                      {reviewAction === "approve" ? "Approval Notes (Optional)" : "Rejection Reason (Required)"}
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder={
                        reviewAction === "approve"
                          ? "Add any notes about the approval..."
                          : "Explain why this document is being rejected..."
                      }
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      rows={4}
                    />
                  </div>

                  {/* Voice Comment */}
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      variant="outline"
                      size="sm"
                      className={`border-purple-500 text-purple-400 hover:bg-purple-500/20 ${
                        isRecording ? "animate-pulse" : ""
                      }`}
                    >
                      {isRecording ? <Mic className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                      {isRecording ? "Stop" : "Voice Note"}
                    </Button>
                    {transcript && (
                      <Button
                        onClick={() => speakText(transcript)}
                        variant="outline"
                        size="sm"
                        className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {transcript && (
                    <Alert className="border-purple-500/50 bg-purple-500/10">
                      <MessageCircle className="h-4 w-4 text-purple-400" />
                      <AlertDescription className="text-purple-200">Voice Note: {transcript}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleDocumentReview(selectedDocument.id, reviewAction, reviewComment)}
                      disabled={isSubmitting || (reviewAction === "reject" && !reviewComment)}
                      className={
                        reviewAction === "approve"
                          ? "bg-green-500 hover:bg-green-600 text-white flex-1"
                          : "bg-red-500 hover:bg-red-600 text-white flex-1"
                      }
                    >
                      {isSubmitting ? "Processing..." : `${reviewAction === "approve" ? "Approve" : "Reject"} Document`}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setReviewAction("")
                        setReviewComment("")
                        setSelectedDocument(null)
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Assistant */}
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>AI Assistant</span>
                </CardTitle>
                <CardDescription className="text-blue-200">Get help with document verification</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push(`/officer/ai-assistant?context=review&app=${applicationId}`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Ask AI About This Case
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Application Timeline */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-sm text-white">Application Submitted</p>
                      <p className="text-xs text-slate-400">{new Date(applicationData?.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div>
                      <p className="text-sm text-white">Under Review</p>
                      <p className="text-xs text-slate-400">Currently being processed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
