import { type NextRequest, NextResponse } from "next/server"
import { azureSpeechService } from "@/lib/azure-speech-service"

export async function POST(request: NextRequest) {
  try {
    const { text, language, voice } = await request.json()

    if (!text) {
      return NextResponse.json({ success: false, error: "Text is required" }, { status: 400 })
    }

    const audioUrl = await azureSpeechService.textToSpeech(
      text,
      language || "en-US",
      voice || azureSpeechService.getVoiceForLanguage(language || "en-US"),
    )

    return NextResponse.json({
      success: true,
      data: { audioUrl },
      service: "azure-speech",
    })
  } catch (error) {
    console.error("Text to speech error:", error)
    return NextResponse.json({ success: false, error: "Text to speech failed" }, { status: 500 })
  }
}
