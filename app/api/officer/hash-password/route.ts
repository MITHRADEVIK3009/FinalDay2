import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password || password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters long",
        },
        { status: 400 },
      )
    }

    // Hash password with salt rounds
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    return NextResponse.json({
      success: true,
      hashedPassword,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Password hashing failed",
      },
      { status: 500 },
    )
  }
}
