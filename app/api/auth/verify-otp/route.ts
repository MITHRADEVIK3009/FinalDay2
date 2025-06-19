import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json()

    // In a real implementation, you would:
    // 1. Verify OTP against stored value
    // 2. Check expiration
    // 3. Create or fetch user

    // For demo, accept any 6-digit OTP
    if (otp.length === 6) {
      const token = sign({ phone, userId: `user_${phone}` }, process.env.JWT_SECRET || "demo-secret", {
        expiresIn: "7d",
      })

      const user = {
        id: `user_${phone}`,
        phone,
        preferred_language: "en",
        voice_enabled: false,
        accessibility_options: [],
      }

      return NextResponse.json({
        success: true,
        data: { token, user },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid OTP",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
      },
      { status: 500 },
    )
  }
}
