import { type NextRequest, NextResponse } from "next/server"
import { llamaService } from "@/lib/llama-service"

export async function POST(request: NextRequest) {
  try {
    const { documentType, content, language } = await request.json()

    if (!documentType || !content) {
      return NextResponse.json({ success: false, error: "Document type and content are required" }, { status: 400 })
    }

    const analysis = await llamaService.generateDocumentSummary(documentType, content)

    return NextResponse.json({
      success: true,
      data: { analysis },
      model: "llama-3-instruct",
    })
  } catch (error) {
    console.error("Document analysis error:", error)
    return NextResponse.json({ success: false, error: "Failed to analyze document" }, { status: 500 })
  }
}
