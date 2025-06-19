import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { voiceCommand, department } = await request.json()

    // In a real implementation, you would:
    // 1. Process voice command through STT
    // 2. Extract officer identification from voice
    // 3. Verify voice biometrics
    // 4. Match against registered voice patterns

    // For demo, accept voice commands containing "officer" and "login"
    if (voiceCommand.toLowerCase().includes("officer") && voiceCommand.toLowerCase().includes("login")) {
      const token = sign(
        {
          department,
          role: "Verifier",
          officerId: "officer_voice_001",
          type: "officer",
          authMethod: "voice",
        },
        process.env.JWT_SECRET || "demo-secret",
        { expiresIn: "8h" },
      )

      const officer = {
        id: "officer_voice_001",
        employeeId: "VOICE001",
        name: "Officer Voice Auth",
        department,
        role: "Verifier",
        permissions: ["review_documents", "moderate_forum"],
        authMethod: "voice",
      }

      return NextResponse.json({
        success: true,
        data: { token, officer },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Voice authentication failed",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Voice login processing failed",
      },
      { status: 500 },
    )
  }
}
