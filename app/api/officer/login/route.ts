import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { employeeId, password, department, role } = await request.json()

    // In a real implementation, you would:
    // 1. Validate credentials against officer database
    // 2. Check department and role permissions
    // 3. Verify 2FA if required

    // For demo, accept specific test credentials
    if (employeeId === "OFF001" && password === "officer123") {
      const token = sign(
        {
          employeeId,
          department,
          role,
          officerId: `officer_${employeeId}`,
          type: "officer",
        },
        process.env.JWT_SECRET || "demo-secret",
        { expiresIn: "8h" },
      )

      const officer = {
        id: `officer_${employeeId}`,
        employeeId,
        name: "Officer Kumar",
        department,
        role,
        permissions: ["review_documents", "moderate_forum", "escalate_cases"],
      }

      return NextResponse.json({
        success: true,
        data: { token, officer },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
      },
      { status: 500 },
    )
  }
}
