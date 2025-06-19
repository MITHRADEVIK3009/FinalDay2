import { type NextRequest, NextResponse } from "next/server"
import { llamaService } from "@/lib/llama-service"

export async function POST(request: NextRequest) {
  try {
    const { message, context, history, language } = await request.json()

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    const response = await llamaService.chatWithAssistant(message, context, history)

    return NextResponse.json({
      success: true,
      data: { response },
      model: "llama-3-chat",
    })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json({ success: false, error: "Failed to process chat request" }, { status: 500 })
  }
}
