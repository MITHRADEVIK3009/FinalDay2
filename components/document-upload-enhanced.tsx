"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Camera, FileText, CheckCircle, AlertCircle, Mic, WifiOff, RefreshCw } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { storeFile, validateFile, runDocumentClassifier } from "@/lib/api-client"
import { useOfflineQueue } from "@/hooks/use-api"
import { VoiceAssistant } from "./voice-assistant"

interface DocumentUploadProps {
  applicationId: string
  userId: string
  language: string
  requiredDocuments: string[]
}

export function DocumentUploadEnhanced({ applicationId, userId, language, requiredDocuments }: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showVoiceHelp, setShowVoiceHelp] = useState(false)
  const { addToQueue } = useOfflineQueue()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const fileId = Date.now().toString()
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

        try {
          if (isOffline) {
            // Add to offline queue
            addToQueue("upload_document", { file, applicationId })
            setUploadedFiles((prev) => [
              ...prev,
              {
                id: fileId,
                name: file.name,
                status: "queued",
                offline: true,
              },
            ])
          } else {
            // Upload immediately
            setUploadProgress((prev) => ({ ...prev, [fileId]: 25 }))
            const uploadResponse = await storeFile(file, applicationId)

            if (uploadResponse.success && uploadResponse.data) {
              setUploadProgress((prev) => ({ ...prev, [fileId]: 50 }))

              // Validate file
              const validationResponse = await validateFile(uploadResponse.data.id)
              setUploadProgress((prev) => ({ ...prev, [fileId]: 75 }))

              // Classify document
              const classificationResponse = await runDocumentClassifier(uploadResponse.data.id)
              setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }))

              setUploadedFiles((prev) => [
                ...prev,
                {
                  id: uploadResponse.data.id,
                  name: file.name,
                  status: validationResponse.success ? "verified" : "error",
                  classification: classificationResponse.data?.classification,
                  confidence: classificationResponse.data?.confidence,
                },
              ])
            }
          }
        } catch (error) {
          setUploadedFiles((prev) => [
            ...prev,
            {
              id: fileId,
              name: file.name,
              status: "error",
              error: "Upload failed",
            },
          ])
        }
      }
    },
    [applicationId, isOffline, addToQueue],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleCameraUpload = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // Camera capture logic would go here
      // For now, we'll simulate it
      console.log("Camera capture initiated")
    } catch (error) {
      console.error("Camera access failed:", error)
    }
  }

  const handleVoiceHelp = (transcript: string) => {
    // Process voice commands for document help
    if (transcript.toLowerCase().includes("what documents")) {
      // Show required documents list
      console.log("Showing required documents:", requiredDocuments)
    }
  }

  return (
    <div className="space-y-6">
      {/* Offline Status */}
      {isOffline && (
        <Alert className="border-orange-500/50 bg-orange-500/10">
          <WifiOff className="h-4 w-4 text-orange-400" />
          <AlertDescription className="text-orange-200">
            You're offline. Documents will be uploaded when connection is restored.
          </AlertDescription>
        </Alert>
      )}

      {/* Voice Assistant */}
      {showVoiceHelp && <VoiceAssistant userId={userId} language={language} onTranscript={handleVoiceHelp} />}

      {/* Upload Area */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Upload Documents</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVoiceHelp(!showVoiceHelp)}
              className="text-purple-400 hover:text-purple-300"
            >
              <Mic className="h-4 w-4 mr-2" />
              Voice Help
            </Button>
          </CardTitle>
          <CardDescription className="text-slate-400">Upload required documents for your application</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Required Documents List */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-white mb-3">Required Documents:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-300">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Drag & Drop Upload */}
            <div
              {...getRootProps()}
              className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                isDragActive ? "border-teal-500 bg-teal-500/10" : "border-slate-600 hover:border-slate-500"
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-white mb-1">{isDragActive ? "Drop files here" : "Drag & drop files"}</p>
                <p className="text-xs text-slate-400">or click to browse</p>
              </div>
            </div>

            {/* Camera Upload */}
            <Button
              onClick={handleCameraUpload}
              variant="outline"
              className="h-full border-slate-600 text-slate-300 hover:bg-slate-700 flex flex-col items-center justify-center space-y-2"
            >
              <Camera className="h-8 w-8" />
              <span>Use Camera</span>
            </Button>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Uploaded Files:</h4>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-white">{file.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === "verified" && <CheckCircle className="h-4 w-4 text-green-400" />}
                      {file.status === "error" && <AlertCircle className="h-4 w-4 text-red-400" />}
                      {file.status === "queued" && <RefreshCw className="h-4 w-4 text-orange-400" />}
                      <Badge
                        variant="secondary"
                        className={
                          file.status === "verified"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : file.status === "error"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                        }
                      >
                        {file.status}
                      </Badge>
                    </div>
                  </div>

                  {uploadProgress[file.id] !== undefined && uploadProgress[file.id] < 100 && (
                    <Progress value={uploadProgress[file.id]} className="h-2 mb-2" />
                  )}

                  {file.classification && (
                    <div className="text-xs text-slate-400">
                      Detected: {file.classification} ({Math.round(file.confidence * 100)}% confidence)
                    </div>
                  )}

                  {file.error && <div className="text-xs text-red-400">{file.error}</div>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
