// ✅ Complete Demo Officer Data and Functions
export const DEMO_OFFICER = {
  id: "demo-officer-001",
  name: "Rajesh Kumar",
  employeeId: "EMP001234",
  email: "rajesh.kumar@tn.gov.in",
  phone: "+91 9876543210",
  department: "Revenue Department",
  role: "Admin",
  designation: "District Collector",
  district: "Chennai",
  office: "Collectorate",
  permissions: [
    "review_documents",
    "approve_applications",
    "reject_applications",
    "moderate_forum",
    "escalate_cases",
    "assign_cases",
    "view_analytics",
    "manage_users",
    "generate_certificates",
    "ai_override",
  ],
  accessLevel: "Level 5 - Super Admin",
  isDemoOfficer: true,
  preferred_language: "en",
  joinedAt: "2024-01-01T00:00:00Z",
  lastLogin: new Date().toISOString(),
  status: "active",
}

export const DEMO_OFFICER_DASHBOARD_DATA = {
  stats: {
    pending: 23,
    approved: 89,
    rejected: 12,
    totalHelped: 567,
    aiAccuracy: "94.2%",
    averageProcessingTime: "2.5 hours",
  },
  pendingApplications: [
    {
      id: "APP-2024-001",
      scheme_title: "Community Certificate",
      citizen_name: "Muthu Selvam",
      citizen_phone: "+91 9876543210",
      citizen_aadhaar: "1234-5678-9012",
      user_id: "USER-001",
      created_at: "2024-06-19T10:30:00Z",
      priority: "High",
      status: "pending",
      documents: [
        {
          id: "DOC-001",
          filename: "aadhaar_card.pdf",
          type: "Aadhaar Card",
          status: "pending",
          size: "2.5 MB",
          created_at: "2024-06-19T10:30:00Z",
          ai_classification: {
            type: "Aadhaar Card",
            confidence: 0.95,
          },
        },
        {
          id: "DOC-002",
          filename: "address_proof.pdf",
          type: "Address Proof",
          status: "pending",
          size: "1.8 MB",
          created_at: "2024-06-19T10:30:00Z",
          ai_classification: {
            type: "Address Proof",
            confidence: 0.88,
          },
        },
      ],
    },
    {
      id: "APP-2024-002",
      scheme_title: "Income Certificate",
      citizen_name: "Priya Sharma",
      citizen_phone: "+91 9876543211",
      citizen_aadhaar: "2345-6789-0123",
      user_id: "USER-002",
      created_at: "2024-06-18T14:20:00Z",
      priority: "Normal",
      status: "under-review",
      documents: [
        {
          id: "DOC-003",
          filename: "salary_slip.pdf",
          type: "Salary Slip",
          status: "verified",
          size: "1.2 MB",
          created_at: "2024-06-18T14:20:00Z",
          ai_classification: {
            type: "Income Document",
            confidence: 0.92,
          },
        },
      ],
    },
  ],
  notifications: [
    {
      id: "NOTIF-001",
      title: "New Application Assigned",
      message: "Community Certificate application from Muthu Selvam has been assigned to you",
      type: "info",
      read: false,
      created_at: "2024-06-19T11:00:00Z",
    },
    {
      id: "NOTIF-002",
      title: "Document Verification Required",
      message: "Income Certificate application requires additional document verification",
      type: "warning",
      read: false,
      created_at: "2024-06-19T10:45:00Z",
    },
  ],
  recentActivity: [
    {
      id: "ACT-001",
      action: "Document Approved",
      description: "Approved Aadhaar card for Rajesh Kumar",
      timestamp: "2024-06-19T09:30:00Z",
      type: "approval",
    },
    {
      id: "ACT-002",
      action: "Application Reviewed",
      description: "Completed review of caste certificate application",
      timestamp: "2024-06-19T08:15:00Z",
      type: "review",
    },
  ],
}

export class DemoOfficerApiClient {
  private static instance: DemoOfficerApiClient

  static getInstance(): DemoOfficerApiClient {
    if (!DemoOfficerApiClient.instance) {
      DemoOfficerApiClient.instance = new DemoOfficerApiClient()
    }
    return DemoOfficerApiClient.instance
  }

  async getOfficerDashboard(officerId: string) {
    await this.delay(500)
    return {
      success: true,
      data: DEMO_OFFICER_DASHBOARD_DATA,
    }
  }

  async getOfficerProfile(officerId: string) {
    await this.delay(300)
    return {
      success: true,
      data: DEMO_OFFICER,
    }
  }

  async updateOfficerLanguage(officerId: string, language: string) {
    await this.delay(200)
    DEMO_OFFICER.preferred_language = language
    return { success: true }
  }

  async generateDailySummary(officerId: string) {
    await this.delay(800)
    const summary = `Daily Summary for ${DEMO_OFFICER.name}:
    
    📊 Today's Statistics:
    • ${DEMO_OFFICER_DASHBOARD_DATA.stats.pending} applications pending review
    • ${DEMO_OFFICER_DASHBOARD_DATA.stats.approved} applications approved
    • ${DEMO_OFFICER_DASHBOARD_DATA.stats.rejected} applications rejected
    
    🎯 Priority Actions:
    • Review high-priority community certificate application
    • Complete document verification for income certificates
    • Follow up on flagged applications
    
    📈 Performance:
    • AI accuracy: ${DEMO_OFFICER_DASHBOARD_DATA.stats.aiAccuracy}
    • Average processing time: ${DEMO_OFFICER_DASHBOARD_DATA.stats.averageProcessingTime}
    
    Have a productive day!`

    return {
      success: true,
      data: {
        summary,
        audioUrl: "/demo-audio/daily-summary.mp3", // Mock audio URL
      },
    }
  }

  async reviewDocument(documentId: string, action: "approve" | "reject", comment: string) {
    await this.delay(600)

    // Update document status in demo data
    const applications = DEMO_OFFICER_DASHBOARD_DATA.pendingApplications
    for (const app of applications) {
      const doc = app.documents.find((d) => d.id === documentId)
      if (doc) {
        doc.status = action === "approve" ? "verified" : "rejected"
        break
      }
    }

    return {
      success: true,
      data: {
        documentId,
        action,
        comment,
        timestamp: new Date().toISOString(),
      },
    }
  }

  async generateCertificate(applicationId: string, certificateData: any) {
    await this.delay(1000)

    const serialNumber = `DEMO/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`

    return {
      success: true,
      data: {
        certificateId: `CERT-${Date.now()}`,
        serialNumber,
        qrCode: `QR${Date.now()}`,
        downloadUrl: "/demo-certificates/certificate.pdf",
        isDemoMode: true,
      },
    }
  }

  async getCitizenHistory(userId: string) {
    await this.delay(400)
    return {
      success: true,
      data: {
        userId,
        totalApplications: 5,
        approvedApplications: 3,
        rejectedApplications: 1,
        pendingApplications: 1,
        lastActivity: "2024-06-19T10:30:00Z",
        applications: [
          {
            id: "APP-2024-001",
            type: "Community Certificate",
            status: "pending",
            submittedAt: "2024-06-19T10:30:00Z",
          },
          {
            id: "APP-2024-002",
            type: "Income Certificate",
            status: "approved",
            submittedAt: "2024-06-15T14:20:00Z",
            approvedAt: "2024-06-17T09:15:00Z",
          },
        ],
      },
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const demoOfficerApi = DemoOfficerApiClient.getInstance()
