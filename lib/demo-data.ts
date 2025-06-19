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
    title: "PMAY Application Approved! 🎉",
    message:
      "Congratulations! Your Pradhan Mantri Awas Yojana application has been approved. Your subsidy amount of ₹2,50,000 will be credited to your account within 7 working days.",
    type: "success",
    read: false,
    created_at: "2024-06-19T14:30:00Z",
    action_url: "/citizen/application/app_001",
  },
  {
    id: "notif_002",
    user_id: "demo_user_123",
    title: "Document Verification Required",
    message:
      "Your SNAP application requires additional document verification. Please upload your latest income certificate to proceed with the application.",
    type: "warning",
    read: false,
    created_at: "2024-06-19T12:15:00Z",
    action_url: "/citizen/upload",
  },
  {
    id: "notif_003",
    user_id: "demo_user_123",
    title: "New Scheme Available: PM-KISAN",
    message:
      "A new farmer support scheme PM-KISAN is now available in your area. You may be eligible for ₹6,000 annual support. Check eligibility now.",
    type: "info",
    read: false,
    created_at: "2024-06-19T09:45:00Z",
    action_url: "/citizen/scheme/scheme_pmkisan",
  },
  {
    id: "notif_004",
    user_id: "demo_user_123",
    title: "Medicaid Application Under Review",
    message:
      "Your Medicaid health coverage application is currently under review. Expected processing time: 5-7 business days. We'll notify you once a decision is made.",
    type: "info",
    read: true,
    created_at: "2024-06-18T16:20:00Z",
    action_url: "/citizen/application/app_003",
  },
  {
    id: "notif_005",
    user_id: "demo_user_123",
    title: "Voice Assistant Update",
    message:
      "Your AI assistant now supports Tamil language! You can now interact with the assistant in Tamil for better assistance with government services.",
    type: "info",
    read: true,
    created_at: "2024-06-18T11:30:00Z",
    action_url: "/citizen/ai-assistant",
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
      "The Supplemental Nutrition Assistance Program (SNAP) provides nutrition benefits to supplement the food budget of needy families so they can purchase healthy food and move towards self-sufficiency.",
    eligibility:
      "Based on household size and income limits. Must be U.S. citizen or qualified non-citizen, meet work requirements if able-bodied adult without dependents.",
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
      "Medicaid provides free or low-cost health coverage to millions of Americans, including some low-income people, families and children, pregnant women, the elderly, and people with disabilities.",
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
    overview:
      "The Housing Choice Voucher Program is the federal government's major program for assisting very low-income families, the elderly, and the disabled to afford decent, safe, and sanitary housing in the private market.",
    eligibility:
      "Income limits (generally 50% of median income), family size, rental history, and clean criminal background required.",
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
    overview:
      "Pradhan Mantri Awas Yojana aims to provide affordable housing to the urban poor with a target of building 20 million affordable houses by 2022.",
    eligibility:
      "EWS/LIG/MIG categories, first-time home buyers, income criteria as per category, should not own a pucca house.",
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
    overview:
      "The Mahatma Gandhi National Rural Employment Guarantee Act guarantees 100 days of wage employment in a financial year to every household whose adult members volunteer to do unskilled manual work.",
    eligibility:
      "Rural residents aged 18+, voluntarily enroll for manual labor, must be willing to work within 5km radius.",
    required_documents: ["Job card from Gram Panchayat", "Aadhaar", "Linked bank account"],
    portal_url: "https://nrega.nic.in/MGNREGA_new/Nrega_home.aspx",
    created_at: "2024-01-01T00:00:00Z",
  },
  // Add more comprehensive schemes...
]

// Mock API functions for demo mode with realistic delays and responses
export class DemoApiClient {
  private static instance: DemoApiClient
  private userId: string = DEMO_USER.id

  static getInstance(): DemoApiClient {
    if (!DemoApiClient.instance) {
      DemoApiClient.instance = new DemoApiClient()
    }
    return DemoApiClient.instance
  }

  // Dashboard stats with real demo data
  async getDashboardStats() {
    await this.delay(500)
    return {
      totalApplications: DEMO_APPLICATIONS.length,
      approved: DEMO_APPLICATIONS.filter((app) => app.status === "approved").length,
      underReview: DEMO_APPLICATIONS.filter((app) => app.status === "under-review").length,
      pending: DEMO_APPLICATIONS.filter((app) => app.status === "pending").length,
      unreadNotifications: DEMO_NOTIFICATIONS.filter((n) => !n.read).length,
    }
  }

  // User applications with real demo data
  async getUserApplications() {
    await this.delay(300)
    return DEMO_APPLICATIONS
  }

  // User notifications with real demo data
  async getUserNotifications() {
    await this.delay(200)
    return DEMO_NOTIFICATIONS
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string) {
    await this.delay(100)
    const notification = DEMO_NOTIFICATIONS.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
    return { success: true }
  }

  // Get unread notification count
  async getUnreadNotificationCount() {
    await this.delay(100)
    return DEMO_NOTIFICATIONS.filter((n) => !n.read).length
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
    return { success: true }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
