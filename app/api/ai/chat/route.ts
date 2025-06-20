import { type NextRequest, NextResponse } from "next/server"
import { azureOpenAIService } from "@/lib/azure-openai-service"

export async function POST(request: NextRequest) {
  try {
    const { message, context, history, language } = await request.json()

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    const response = await azureOpenAIService.chatWithAssistant(message, context, history)

    return NextResponse.json({
      success: true,
      data: { response },
      model: "azure-openai-gpt-4",
    })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json({ success: false, error: "Failed to process chat request" }, { status: 500 })
  }
}
