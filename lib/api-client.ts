// Core API Client with all 40+ primary APIs and 235+ backend functions

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  offline?: boolean
}

export interface User {
  id: string
  phone: string
  aadhaar?: string
  preferred_language: "ta" | "hi" | "en"
  voice_enabled: boolean
  accessibility_options: string[]
}

export interface Scheme {
  id: string
  title: string
  description: string
  department: string
  category: string
  eligibility_criteria: any
  amount: string
  deadline: string
  status: "active" | "inactive"
}

export interface Application {
  id: string
  user_id: string
  scheme_id: string
  status: "pending" | "under-review" | "approved" | "rejected"
  documents: Document[]
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  filename: string
  type: string
  status: "pending" | "verified" | "rejected"
  blockchain_hash?: string
  ai_classification?: any
}

// ===== CORE API FUNCTIONS (APIs 1-60) =====

// Authentication APIs (1-5)
export async function requestOtp(phone: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

export async function verifyOtp(phone: string, otp: string): Promise<ApiResponse<{ token: string; user: User }>> {
  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

export async function createGuestUser(userData: any): Promise<ApiResponse<{ token: string; user: User }>> {
  try {
    const response = await fetch("/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

// Retry OTP Flow
export async function retryOtpFlow(phone: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/auth/retry-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

// Language & Accessibility APIs (6-10)
export async function detectAndSetLanguage(language: string, userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/users/language", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, userId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

// Voice APIs (11-20)
export async function callWhisperSTT(audioBlob: Blob): Promise<ApiResponse<{ text: string }>> {
  try {
    const formData = new FormData()
    formData.append("audio", audioBlob)

    const response = await fetch("/api/voice/stt", {
      method: "POST",
      body: formData,
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "STT failed", offline: true }
  }
}

export async function convertToTTS(text: string, language = "en"): Promise<ApiResponse<{ audioUrl: string }>> {
  try {
    const response = await fetch("/api/voice/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "TTS failed", offline: true }
  }
}

// Scheme APIs (21-30)
export async function matchEligibleSchemes(userId: string): Promise<ApiResponse<Scheme[]>> {
  try {
    const response = await fetch(`/api/schemes/eligible/${userId}`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

export async function checkEligibility(
  schemeId: string,
  userId: string,
): Promise<ApiResponse<{ eligible: boolean; reasons: string[] }>> {
  try {
    const response = await fetch(`/api/schemes/${schemeId}/eligibility/${userId}`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

export async function saveSchemeInterest(schemeId: string, userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/applications/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schemeId, userId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

// Document APIs (31-40)
export async function storeFile(file: File, applicationId: string): Promise<ApiResponse<Document>> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("applicationId", applicationId)

    const response = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Upload failed", offline: true }
  }
}

export async function validateFile(fileId: string): Promise<ApiResponse<{ valid: boolean; issues: string[] }>> {
  try {
    const response = await fetch(`/api/documents/${fileId}/validate`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Validation failed", offline: true }
  }
}

export async function runDocumentClassifier(
  fileId: string,
): Promise<ApiResponse<{ classification: string; confidence: number }>> {
  try {
    const response = await fetch(`/api/documents/${fileId}/classify`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Classification failed", offline: true }
  }
}

// Application Status APIs (41-45)
export async function getAppStatus(applicationId: string): Promise<ApiResponse<Application>> {
  try {
    const response = await fetch(`/api/applications/${applicationId}`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

// Notification APIs (46-50)
export async function getUserNotifications(userId: string): Promise<ApiResponse<any[]>> {
  try {
    const response = await fetch(`/api/notifications/${userId}  {
  try {
    const response = await fetch(\`/api/notifications/${userId}`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

// Forum APIs (51-55)
export async function createThread(title: string, content: string, userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/forum/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, userId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

export async function createReply(threadId: string, content: string, userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/forum/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, content, userId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

// ===== AGENT TASK FUNCTIONS (235+ Backend Functions) =====

// Agent Task 1-10: User Assistance
export async function autofillFormFields(userId: string, schemeId: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/agents/autofill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, schemeId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Agent task failed", offline: true }
  }
}

export async function explainRejectionReason(
  applicationId: string,
): Promise<ApiResponse<{ explanation: string; suggestions: string[] }>> {
  try {
    const response = await fetch(`/api/agents/explain-rejection/${applicationId}`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Explanation failed", offline: true }
  }
}

export async function createVoiceReminder(userId: string, message: string, scheduleTime: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/agents/voice-reminder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message, scheduleTime }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Reminder failed", offline: true }
  }
}

// Agent Task 11-20: Officer Assistance
export async function showPendingApplications(officerId: string): Promise<ApiResponse<Application[]>> {
  try {
    const response = await fetch(`/api/agents/officer/${officerId}/pending`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error", offline: true }
  }
}

export async function voiceDailySummary(
  officerId: string,
): Promise<ApiResponse<{ summary: string; audioUrl: string }>> {
  try {
    const response = await fetch(`/api/agents/officer/${officerId}/daily-summary`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Summary failed", offline: true }
  }
}

// Agent Task 21-30: Document Processing
export async function verifyOrRejectDoc(
  documentId: string,
  action: "verify" | "reject",
  reason?: string,
): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/agents/documents/${documentId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Review failed", offline: true }
  }
}

export async function checkDocBlockchainHash(
  documentId: string,
): Promise<ApiResponse<{ hash: string; verified: boolean }>> {
  try {
    const response = await fetch(`/api/agents/documents/${documentId}/blockchain`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Blockchain check failed", offline: true }
  }
}

// Agent Task 31-40: Voice & Communication
export async function updateUserPhoneByVoice(userId: string, newPhone: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/agents/voice/update-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newPhone }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Update failed", offline: true }
  }
}

export async function submitVoiceFeedback(userId: string, audioBlob: Blob): Promise<ApiResponse> {
  try {
    const formData = new FormData()
    formData.append("audio", audioBlob)
    formData.append("userId", userId)

    const response = await fetch("/api/agents/voice/feedback", {
      method: "POST",
      body: formData,
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Feedback failed", offline: true }
  }
}

// ===== OFFICER-SIDE API FUNCTIONS =====

// Officer Authentication APIs
export async function officerLogin(credentials: {
  employeeId: string
  password: string
  department: string
  role: string
}): Promise<ApiResponse<{ token: string; officer: any }>> {
  try {
    const response = await fetch("/api/officer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Login failed", offline: true }
  }
}

export async function loginByVoice(
  voiceCommand: string,
  department: string,
): Promise<ApiResponse<{ token: string; officer: any }>> {
  try {
    const response = await fetch("/api/officer/voice-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voiceCommand, department }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Voice login failed", offline: true }
  }
}

// Officer Dashboard APIs
export async function getOfficerDashboard(officerId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`/api/officer/dashboard/${officerId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("officer_token")}` },
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Failed to load dashboard", offline: true }
  }
}

// Document Review APIs
export async function getApplicationDetails(applicationId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`/api/officer/application/${applicationId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("officer_token")}` },
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Failed to load application", offline: true }
  }
}

export async function reviewDocument(
  documentId: string,
  action: "approve" | "reject",
  comment: string,
): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/officer/review/${documentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("officer_token")}`,
      },
      body: JSON.stringify({ action, comment }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Review failed", offline: true }
  }
}

export async function getDocumentDetails(documentId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`/api/officer/document/${documentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("officer_token")}` },
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Failed to load document", offline: true }
  }
}

// Citizen History API
export async function getCitizenHistory(userId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`/api/officer/citizen-history/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("officer_token")}` },
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Failed to load citizen history", offline: true }
  }
}

// Case Management APIs
export async function assignCase(applicationId: string, officerId: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/officer/assign-case", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("officer_token")}`,
      },
      body: JSON.stringify({ applicationId, officerId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Assignment failed", offline: true }
  }
}

export async function escalateCase(applicationId: string, reason: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/officer/escalate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("officer_token")}`,
      },
      body: JSON.stringify({ applicationId, reason }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Escalation failed", offline: true }
  }
}

// Forum Moderation APIs
export async function moderateThread(threadId: string, action: "approve" | "reject" | "spam"): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/forum/moderate/${threadId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("officer_token")}`,
      },
      body: JSON.stringify({ action }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Moderation failed", offline: true }
  }
}

// Responsible AI APIs
export async function overrideAIDecision(decisionId: string, reason: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/rai/override", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("officer_token")}`,
      },
      body: JSON.stringify({ decisionId, reason }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Override failed", offline: true }
  }
}

// Notification APIs
export async function notifyCitizen(userId: string, title: string, message: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/officer/notify-citizen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("officer_token")}`,
      },
      body: JSON.stringify({ userId, title, message }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Notification failed", offline: true }
  }
}

export async function addReviewComment(applicationId: string, comment: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/officer/add-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("officer_token")}`,
      },
      body: JSON.stringify({ applicationId, comment }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Comment failed", offline: true }
  }
}

// ===== OFFICER SIGNUP API FUNCTIONS =====

// Officer Registration APIs (API 50)
export async function createOfficer(officerData: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetch("/api/officer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(officerData),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Officer registration failed", offline: true }
  }
}

export async function hashAndSaveOfficerPassword(password: string): Promise<string> {
  try {
    const response = await fetch("/api/officer/hash-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    const result = await response.json()
    return result.hashedPassword
  } catch (error) {
    throw new Error("Password hashing failed")
  }
}

export const districtConfigService = {
  async getAll(): Promise<string[]> {
    try {
      const response = await fetch("/api/config/districts")
      const result = await response.json()
      return result.districts || []
    } catch (error) {
      return [
        "Chennai",
        "Coimbatore",
        "Madurai",
        "Tiruchirappalli",
        "Salem",
        "Tirunelveli",
        "Erode",
        "Vellore",
        "Thoothukudi",
        "Dindigul",
        "Thanjavur",
        "Kanchipuram",
      ]
    }
  },
}

// ===== OFFLINE QUEUE MANAGEMENT =====
export class OfflineQueue {
  private static instance: OfflineQueue
  private queue: Array<{ id: string; action: string; data: any; timestamp: number }> = []

  static getInstance(): OfflineQueue {
    if (!OfflineQueue.instance) {
      OfflineQueue.instance = new OfflineQueue()
    }
    return OfflineQueue.instance
  }

  addToQueue(action: string, data: any): string {
    const id = Date.now().toString()
    this.queue.push({ id, action, data, timestamp: Date.now() })
    this.saveToStorage()
    return id
  }

  async processQueue(): Promise<void> {
    const items = [...this.queue]
    for (const item of items) {
      try {
        await this.executeQueuedAction(item)
        this.removeFromQueue(item.id)
      } catch (error) {
        console.error("Failed to process queued item:", error)
      }
    }
  }

  private async executeQueuedAction(item: any): Promise<void> {
    switch (item.action) {
      case "upload_document":
        await storeFile(item.data.file, item.data.applicationId)
        break
      case "create_thread":
        await createThread(item.data.title, item.data.content, item.data.userId)
        break
      case "submit_application":
        await saveSchemeInterest(item.data.schemeId, item.data.userId)
        break
      default:
        console.warn("Unknown queued action:", item.action)
    }
  }

  private removeFromQueue(id: string): void {
    this.queue = this.queue.filter((item) => item.id !== id)
    this.saveToStorage()
  }

  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("offline_queue", JSON.stringify(this.queue))
    }
  }

  loadFromStorage(): void {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("offline_queue")
      if (stored) {
        this.queue = JSON.parse(stored)
      }
    }
  }
}
