import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { applicationId: string } }) {
  try {
    const applicationId = params.applicationId

    // Mock application details
    const applicationData = {
      id: applicationId,
      citizen_name: "Ravi Kumar",
      citizen_phone: "+91 9876543210",
      citizen_aadhaar: "1234-5678-9012-3456",
      user_id: "user_001",
      scheme_title: "PM Kisan Samman Nidhi",
      scheme_description: "Financial assistance of ₹6000 per year to small and marginal farmers",
      scheme_department: "Agriculture",
      scheme_category: "Farmer",
      created_at: "2024-06-19T10:30:00Z",
      status: "under-review",
      documents: [
        {
          id: "doc_001",
          filename: "land_certificate.pdf",
          type: "Land Certificate",
          status: "pending",
          size: "2.5 MB",
          created_at: "2024-06-19T10:30:00Z",
          ai_classification: {
            type: "Land Ownership Certificate",
            confidence: 0.95,
          },
          blockchain_hash: "0x1234567890abcdef",
        },
        {
          id: "doc_002",
          filename: "aadhaar_copy.pdf",
          type: "Identity Proof",
          status: "pending",
          size: "1.2 MB",
          created_at: "2024-06-19T10:32:00Z",
          ai_classification: {
            type: "Aadhaar Card",
            confidence: 0.98,
          },
          blockchain_hash: "0xabcdef1234567890",
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: applicationData,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load application details",
      },
      { status: 500 },
    )
  }
}
