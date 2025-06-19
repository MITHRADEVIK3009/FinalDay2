"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Camera, FileText, CheckCircle, AlertCircle, ArrowLeft, Folder } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"

// ✅ Document Upload Page with Local Storage Support
export default function DocumentUploadPage() {
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isDemoMode] = useState(() => localStorage.getItem("demo_mode") === "true")

  // ✅ File upload handler with local storage support
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

        try {
          // ✅ Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              const currentProgress = prev[fileId] || 0
              if (currentProgress >= 100) {
                clearInterval(progressInterval)
                return prev
              }
              return { ...prev, [fileId]: currentProgress + 10 }
            })
          }, 200)

          // ✅ Store file information locally for demo
          if (isDemoMode) {
            setTimeout(() => {
              setUploadedFiles((prev) => [
                ...prev,
                {
                  id: fileId,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  status: "verified",
                  uploadedAt: new Date().toISOString(),
                  classification: getDocumentType(file.name),
                  confidence: 0.95,
                },
              ])
              clearInterval(progressInterval)
              setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }))
            }, 2000)
          } else {
            // ✅ Real API call for production
            const formData = new FormData()
            formData.append("file", file)
            formData.append("userId", JSON.parse(localStorage.getItem("user_data") || "{}").id)

            const response = await fetch("/api/documents/upload", {
              method: "POST",
              body: formData,
            })

            if (response.ok) {
              const result = await response.json()
              setUploadedFiles((prev) => [...prev, result.document])
            } else {
              throw new Error("Upload failed")
            }
            clearInterval(progressInterval)
            setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }))
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
    [isDemoMode],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  // ✅ Document type classification
  const getDocumentType = (filename: string) => {
    const name = filename.toLowerCase()
    if (name.includes("aadhaar") || name.includes("aadhar")) return "Aadhaar Card"
    if (name.includes("pan")) return "PAN Card"
    if (name.includes("income")) return "Income Certificate"
    if (name.includes("caste")) return "Caste Certificate"
    if (name.includes("photo")) return "Passport Photo"
    return "General Document"
  }

  // ✅ Camera capture handler
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // For demo, we'll simulate camera capture
      const fileId = Date.now().toString()
      setUploadedFiles((prev) => [
        ...prev,
        {
          id: fileId,
          name: `camera_capture_${Date.now()}.jpg`,
          status: "verified",
          classification: "Camera Capture",
          confidence: 0.9,
          uploadedAt: new Date().toISOString(),
        },
      ])
      stream.getTracks().forEach((track) => track.stop())
    } catch (error) {
      console.error("Camera access failed:", error)
      alert("Camera access denied or not available")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            {isDemoMode && (
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                Demo Mode
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Upload Documents</h1>
            <p className="text-slate-400">Upload your documents securely for application processing</p>
          </div>

          {/* ✅ Upload Area */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Document Upload</CardTitle>
              <CardDescription className="text-slate-400">
                Drag and drop files or click to browse. Supported formats: PDF, JPG, PNG, DOC, DOCX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* ✅ Drag & Drop Upload */}
                <div
                  {...getRootProps()}
                  className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                    isDragActive ? "border-teal-500 bg-teal-500/10" : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg text-white mb-2">{isDragActive ? "Drop files here" : "Choose from Device"}</p>
                    <p className="text-sm text-slate-400">Drag & drop files or click to browse</p>
                    <p className="text-xs text-slate-500 mt-2">Max file size: 10MB</p>
                  </div>
                </div>

                {/* ✅ Camera Upload */}
                <div
                  onClick={handleCameraCapture}
                  className="p-8 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-all"
                >
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg text-white mb-2">Use Camera</p>
                    <p className="text-sm text-slate-400">Take a photo of your document</p>
                    <p className="text-xs text-slate-500 mt-2">Ensure good lighting</p>
                  </div>
                </div>
              </div>

              {/* ✅ Required Documents List */}
              <div className="bg-slate-700/30 p-4 rounded-lg mb-6">
                <h4 className="text-white font-medium mb-3">Commonly Required Documents:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Aadhaar Card</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>PAN Card</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Income Certificate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Caste Certificate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Passport Size Photo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Bank Passbook</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Uploaded Documents ({uploadedFiles.length})</CardTitle>
                <CardDescription className="text-slate-400">Your uploaded documents and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <div>
                            <h4 className="font-medium text-white">{file.name}</h4>
                            <p className="text-sm text-slate-400">
                              {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Camera capture"} •{" "}
                              {new Date(file.uploadedAt || Date.now()).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.status === "verified" && <CheckCircle className="h-5 w-5 text-green-400" />}
                          {file.status === "error" && <AlertCircle className="h-5 w-5 text-red-400" />}
                          <Badge
                            variant="secondary"
                            className={
                              file.status === "verified"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            }
                          >
                            {file.status}
                          </Badge>
                        </div>
                      </div>

                      {uploadProgress[file.id] !== undefined && uploadProgress[file.id] < 100 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Uploading...</span>
                            <span className="text-white">{uploadProgress[file.id]}%</span>
                          </div>
                          <Progress value={uploadProgress[file.id]} className="h-2" />
                        </div>
                      )}

                      {file.classification && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">
                            Detected: <span className="text-white">{file.classification}</span>
                          </span>
                          {file.confidence && (
                            <span className="text-green-400">{Math.round(file.confidence * 100)}% confidence</span>
                          )}
                        </div>
                      )}

                      {file.error && <div className="text-sm text-red-400 mt-2">{file.error}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
