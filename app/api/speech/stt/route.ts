import { type NextRequest, NextResponse } from "next/server"
import { azureSpeechService } from "@/lib/azure-speech-service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const language = (formData.get("language") as string) || "en-US"

    if (!audioFile) {
      return NextResponse.json(
        {
          success: false,
          error: "No audio file provided",
        },
        { status: 400 },
      )
    }

    // Convert File to Blob
    const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type })

    // Use Azure Speech Services for recognition
    const text = await azureSpeechService.speechToText(audioBlob, language)

    return NextResponse.json({
      success: true,
      data: { text },
      service: "azure-speech",
    })
  } catch (error) {
    console.error("Speech recognition error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Speech recognition failed",
      },
      { status: 500 },
    )
  }
}
