import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { officerId: string } }) {
  try {
    const officerId = params.officerId

    // Mock dashboard data
    const dashboardData = {
      stats: {
        pending: 15,
        approved: 24,
        rejected: 3,
        totalHelped: 156,
      },
      pendingApplications: [
        {
          id: "app_001",
          scheme_title: "PM Kisan Samman Nidhi",
          citizen_name: "Ravi Kumar",
          citizen_phone: "+91 9876543210",
          citizen_aadhaar: "1234-5678-9012",
          user_id: "user_001",
          created_at: "2024-06-19T10:30:00Z",
          priority: "High",
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
            },
          ],
        },
        {
          id: "app_002",
          scheme_title: "Ayushman Bharat",
          citizen_name: "Priya Sharma",
          citizen_phone: "+91 9876543211",
          citizen_aadhaar: "2345-6789-0123",
          user_id: "user_002",
          created_at: "2024-06-19T09:15:00Z",
          priority: "Normal",
          documents: [
            {
              id: "doc_002",
              filename: "income_certificate.pdf",
              type: "Income Certificate",
              status: "pending",
              size: "1.8 MB",
              created_at: "2024-06-19T09:15:00Z",
              ai_classification: {
                type: "Income Certificate",
                confidence: 0.88,
              },
            },
          ],
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: dashboardData,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load dashboard data",
      },
      { status: 500 },
    )
  }
}
