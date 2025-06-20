"use client"

// components/officer/document-verification-workspace.tsx

import { useState } from "react"
// Import the enhanced AI client
import { enhancedAIClient } from "@/lib/ai-client-enhanced"

const DocumentVerificationWorkspace = () => {
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [currentLanguage, setCurrentLanguage] = useState("en") // Default language

  const handleAnalyzeDocument = async (doc: any) => {
    setAnalyzing(true)
    try {
      const result = await enhancedAIClient.analyzeDocumentWithAI(
        doc.type,
        doc.content || "Document content for analysis",
        currentLanguage,
      )

      if (result.success) {
        setAnalysisResult({
          ...result.data,
          documentId: doc.id,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div>
      <h1>Document Verification Workspace</h1>
      {/* Example Document Input (Replace with your actual input) */}
      <button
        onClick={() =>
          handleAnalyzeDocument({
            type: "passport",
            content: "Example passport content",
            id: "123",
          })
        }
        disabled={analyzing}
      >
        {analyzing ? "Analyzing..." : "Analyze Document"}
      </button>

      {analysisResult && (
        <div>
          <h2>Analysis Result:</h2>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default DocumentVerificationWorkspace
export { DocumentVerificationWorkspace }
