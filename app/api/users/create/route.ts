import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // In a real implementation, you would:
    // 1. Validate all user data
    // 2. Check for duplicate phone/aadhaar
    // 3. Store in database with proper encryption
    // 4. Set up user profile and preferences
    // 5. Initialize agent memory tokens

    // For demo, create user with provided data
    const userId = `user_${userData.phone}`

    const token = sign(
      {
        phone: userData.phone,
        userId,
        type: "citizen",
      },
      process.env.JWT_SECRET || "demo-secret",
      { expiresIn: "30d" },
    )

    const user = {
      id: userId,
      phone: userData.phone,
      name: userData.name,
      aadhaar: userData.aadhaar,
      age: userData.age,
      dateOfBirth: userData.dateOfBirth,
      caste: userData.caste,
      fatherName: userData.fatherName,
      motherName: userData.motherName,
      address: userData.address,
      preferred_language: userData.preferred_language,
      voice_enabled: userData.voice_enabled,
      accessibility_options: userData.accessibility_options,
      consent: userData.consent,
      createdAt: new Date().toISOString(),
      status: "active",
    }

    return NextResponse.json({
      success: true,
      data: { token, user },
      message: "User registration completed successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "User registration failed",
      },
      { status: 500 },
    )
  }
}
