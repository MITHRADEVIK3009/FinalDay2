// Demo user data and mock functions for testing without database
export const DEMO_USER = {
  id: "demo_user_123",
  phone: "+91-9876543210",
  name: "Demo Citizen",
  email: "demo@citizen.gov",
  aadhaar: "1234-5678-9012",
  age: 28,
  dateOfBirth: "1996-01-15",
  caste: "General",
  fatherName: "Demo Father",
  motherName: "Demo Mother",
  address: {
    street: "123 Demo Street",
    district: "Demo District",
    state: "Demo State",
    pincode: "123456",
  },
  preferred_language: "English",
  voice_enabled: true,
  accessibility_options: ["large_text", "voice_navigation"],
  consent: true,
  createdAt: new Date().toISOString(),
  status: "active",
}

export const DEMO_APPLICATIONS = [
  {
    id: "app_001",
    user_id: "demo_user_123",
    scheme_id: "scheme_pmay",
    status: "approved",
    progress: 100,
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2024-06-15T14:30:00Z",
    schemes: {
      title: "Pradhan Mantri Awas Yojana",
      description: "Housing subsidy for economically weaker sections",
      department: "Ministry of Housing",
    },
  },
  {
    id: "app_002",
    user_id: "demo_user_123",
    scheme_id: "scheme_snap",
    status: "under-review",
    progress: 75,
    created_at: "2024-06-10T09:15:00Z",
    updated_at: "2024-06-18T11:20:00Z",
    schemes: {
      title: "SNAP Food Assistance",
      description: "Food purchasing assistance for low-income families",
      department: "USDA",
    },
  },
  {
    id: "app_003",
    user_id: "demo_user_123",
    scheme_id: "scheme_medicaid",
    status: "pending",
    progress: 25,
    created_at: "2024-06-18T16:45:00Z",
    updated_at: "2024-06-18T16:45:00Z",
    schemes: {
      title: "Medicaid Health Coverage",
      description: "Free or low-cost health coverage",
      department: "CMS",
    },
  },
]

export const DEMO_NOTIFICATIONS = [
  {
    id: "notif_001",
    user_id: "demo_user_123",
    title: "Land Certificate Approved",
    message: "Your land ownership certificate has been approved and is ready for download.",
    type: "success",
    read: false,
    created_at: "2024-06-18T14:00:00Z",
  },
  {
    id: "notif_002",
    user_id: "demo_user_123",
    title: "Document verification pending",
    message: "Please submit additional documents for your SNAP application.",
    type: "warning",
    read: false,
    created_at: "2024-06-18T12:30:00Z",
  },
  {
    id: "notif_003",
    user_id: "demo_user_123",
    title: "New scheme available for farmers",
    message: "PM-KISAN scheme is now accepting applications in your area.",
    type: "info",
    read: true,
    created_at: "2024-06-17T09:15:00Z",
  },
]

export const DEMO_SCHEMES = [
  // USA Schemes
  {
    id: "scheme_snap",
    title: "SNAP (Supplemental Nutrition Assistance Program)",
    description: "Food assistance for low-income individuals and families",
    country: "USA",
    department: "USDA",
    category: "Food Assistance",
    status: "active",
    overview:
      "Free or low-cost health coverage for low-income individuals, seniors, pregnant women, children, and people with disabilities.",
    eligibility:
      "Based on state-specific income limits, U.S. residency/citizenship; some states offer expansion up to 138% FPL.",
    required_documents: [
      "Proof of identity (driver's license, passport)",
      "Social Security Number",
      "Proof of income (pay stubs, tax returns)",
      "Proof of expenses (rent/mortgage, utility bills)",
      "Citizenship or immigration status proof",
    ],
    portal_url: "https://www.fns.usda.gov/snap",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "scheme_medicaid",
    title: "Medicaid",
    description: "Free or low-cost health coverage for eligible individuals",
    country: "USA",
    department: "CMS",
    category: "Healthcare",
    status: "active",
    overview:
      "Free or low-cost health coverage for low-income individuals, seniors, pregnant women, children, and people with disabilities.",
    eligibility:
      "Based on state-specific income limits, U.S. residency/citizenship; some states offer expansion up to 138% FPL.",
    required_documents: [
      "Photo ID",
      "Proof of citizenship/immigration",
      "Income proof (pay stubs, tax return)",
      "Proof of residency",
      "Asset documentation (for long-term care)",
    ],
    portal_url: "https://www.medicaid.gov/",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "scheme_section8",
    title: "Section 8 Housing Choice Voucher",
    description: "Rental assistance program for low-income families",
    country: "USA",
    department: "HUD",
    category: "Housing",
    status: "active",
    overview: "Rental assistance program for low-income families, seniors, and disabled individuals.",
    eligibility: "Income limits, family size, rental history, and clean criminal background required.",
    required_documents: ["Income proof", "Family composition (birth certificates)", "Rental and eviction history"],
    portal_url: "https://www.hud.gov/topics/housing_choice_voucher_program_section_8",
    created_at: "2024-01-01T00:00:00Z",
  },
  // India Schemes
  {
    id: "scheme_pmay",
    title: "Pradhan Mantri Awas Yojana (PMAY)",
    description: "Housing subsidy for economically weaker sections",
    country: "India",
    department: "Ministry of Housing",
    category: "Housing",
    status: "active",
    overview: "Provides housing subsidy to economically weaker sections.",
    eligibility: "EWS/LIG/MIG categories, first-time home buyers, income criteria as per category.",
    required_documents: [
      "Aadhaar card",
      "Income certificate",
      "Identity proof (PAN, Voter ID)",
      "Address proof (ration card, utility bill)",
      "Property documents or no-home declaration",
    ],
    portal_url: "https://pmaymis.gov.in/",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "scheme_mgnrega",
    title: "MGNREGA",
    description: "100 guaranteed days of paid work per year for rural households",
    country: "India",
    department: "Ministry of Rural Development",
    category: "Employment",
    status: "active",
    overview: "100 guaranteed days of paid unskilled job work per year for rural households via rights legislation.",
    eligibility: "Rural residents aged 18+, voluntarily enroll for manual labor.",
    required_documents: ["Job card from Gram Panchayat", "Aadhaar", "Linked bank account"],
    portal_url: "https://nrega.nic.in/MGNREGA_new/Nrega_home.aspx",
    created_at: "2024-01-01T00:00:00Z",
  },
  // Add more schemes as needed...
]

// Mock API functions for demo mode
export class DemoApiClient {
  private static instance: DemoApiClient
  private userId: string = DEMO_USER.id

  static getInstance(): DemoApiClient {
    if (!DemoApiClient.instance) {
      DemoApiClient.instance = new DemoApiClient()
    }
    return DemoApiClient.instance
  }

  async getDashboardStats() {
    await this.delay(500) // Simulate API delay
    return {
      totalApplications: DEMO_APPLICATIONS.length,
      approved: DEMO_APPLICATIONS.filter((app) => app.status === "approved").length,
      underReview: DEMO_APPLICATIONS.filter((app) => app.status === "under-review").length,
      pending: DEMO_APPLICATIONS.filter((app) => app.status === "pending").length,
      unreadNotifications: DEMO_NOTIFICATIONS.filter((n) => !n.read).length,
    }
  }

  async getUserApplications() {
    await this.delay(300)
    return DEMO_APPLICATIONS
  }

  async getUserNotifications() {
    await this.delay(200)
    return DEMO_NOTIFICATIONS
  }

  async getRecommendedSchemes() {
    await this.delay(400)
    return DEMO_SCHEMES.slice(0, 7)
  }

  async getPopularSchemes() {
    await this.delay(400)
    return DEMO_SCHEMES.slice(7, 25)
  }

  async getSchemeById(schemeId: string) {
    await this.delay(300)
    return DEMO_SCHEMES.find((scheme) => scheme.id === schemeId) || null
  }

  async createApplication(schemeId: string) {
    await this.delay(800)
    const scheme = DEMO_SCHEMES.find((s) => s.id === schemeId)
    const newApp = {
      id: `app_${Date.now()}`,
      user_id: this.userId,
      scheme_id: schemeId,
      status: "pending",
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      schemes: {
        title: scheme?.title || "Unknown Scheme",
        description: scheme?.description || "",
        department: scheme?.department || "",
      },
    }
    DEMO_APPLICATIONS.unshift(newApp)
    return newApp
  }

  async logUserAction(action: string, details: any) {
    console.log(`[DEMO] User Action: ${action}`, details)
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
