import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId

    // Mock eligible schemes based on user profile
    const eligibleSchemes = [
      {
        id: "pm-kisan",
        title: "PM Kisan Samman Nidhi",
        description: "Financial assistance of ₹6000 per year to small and marginal farmers",
        department: "Agriculture",
        category: "Farmer",
        eligibility_criteria: { landSize: "small", occupation: "farmer" },
        amount: "₹6,000/year",
        deadline: "2024-12-31",
        status: "active",
      },
      {
        id: "ayushman-bharat",
        title: "Ayushman Bharat",
        description: "Health insurance scheme providing coverage up to ₹5 lakh per family",
        department: "Health & Family Welfare",
        category: "Health",
        eligibility_criteria: { income: "below-poverty-line" },
        amount: "₹5 Lakh coverage",
        deadline: "Ongoing",
        status: "active",
      },
    ]

    return NextResponse.json({
      success: true,
      data: eligibleSchemes,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch eligible schemes",
      },
      { status: 500 },
    )
  }
}
