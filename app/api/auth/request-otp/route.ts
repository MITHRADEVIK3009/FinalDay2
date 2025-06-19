import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    // Simulate OTP generation and sending
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // In a real implementation, you would:
    // 1. Generate OTP
    // 2. Store it in database with expiration
    // 3. Send via SMS service

    console.log(`OTP for ${phone}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send OTP",
      },
      { status: 500 },
    )
  }
}
