import { supabase } from "./supabase"
import type { CitizenProfile, Application, Scheme, Document, Notification, SupportTicket } from "./supabase"

// Enhanced API Client with Supabase Integration
export class ApiClient {
  private static instance: ApiClient
  private userId: string | null = null

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  // ===== CITIZEN PROFILE APIs =====
  async getCitizenProfile(): Promise<CitizenProfile | null> {
    if (!this.userId) throw new Error("User not authenticated")

    const { data, error } = await supabase.from("citizen_profiles").select("*").eq("user_id", this.userId).single()

    if (error) throw error
    return data
  }

  async updateCitizenProfile(updates: Partial<CitizenProfile>): Promise<CitizenProfile> {
    if (!this.userId) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("citizen_profiles")
      .update(updates)
      .eq("user_id", this.userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // ===== APPLICATION APIs =====
  async getUserApplications(): Promise<Application[]> {
    if (!this.userId) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        schemes:scheme_id (title, description, department),
        documents (*)
      `)
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getApplicationById(applicationId: string): Promise<Application | null> {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        schemes:scheme_id (*),
        documents (*)
      `)
      .eq("id", applicationId)
      .single()

    if (error) throw error
    return data
  }

  async createApplication(schemeId: string): Promise<Application> {
    if (!this.userId) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: this.userId,
        scheme_id: schemeId,
        status: "pending",
        progress: 0,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // ===== SCHEME APIs =====
  async getRecommendedSchemes(): Promise<Scheme[]> {
    const { data, error } = await supabase.from("schemes").select("*").eq("status", "active").limit(7)

    if (error) throw error
    return data || []
  }

  async getPopularSchemes(): Promise<Scheme[]> {
    const { data, error } = await supabase.from("schemes").select("*").eq("status", "active").range(7, 24)

    if (error) throw error
    return data || []
  }

  async getAllSchemes(): Promise<Scheme[]> {
    const { data, error } = await supabase
      .from("schemes")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getSchemeById(schemeId: string): Promise<Scheme | null> {
    const { data, error } = await supabase.from("schemes").select("*").eq("id", schemeId).single()

    if (error) throw error
    return data
  }

  // ===== DOCUMENT APIs =====
  async uploadDocument(file: File, applicationId: string, documentType: string): Promise<Document> {
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `documents/${this.userId}/${fileName}`

    const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file)

    if (uploadError) throw uploadError

    // Create document record
    const { data, error } = await supabase
      .from("documents")
      .insert({
        application_id: applicationId,
        filename: file.name,
        file_path: filePath,
        document_type: documentType,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getDocumentsByApplication(applicationId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("application_id", applicationId)
      .order("uploaded_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  // ===== NOTIFICATION APIs =====
  async getUserNotifications(): Promise<Notification[]> {
    if (!this.userId) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) throw error
    return data || []
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

    if (error) throw error
  }

  async getUnreadNotificationCount(): Promise<number> {
    if (!this.userId) return 0

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", this.userId)
      .eq("read", false)

    if (error) throw error
    return count || 0
  }

  // ===== SUPPORT TICKET APIs =====
  async createSupportTicket(
    subject: string,
    description: string,
    priority: "low" | "medium" | "high" | "urgent" = "medium",
  ): Promise<SupportTicket> {
    if (!this.userId) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        user_id: this.userId,
        subject,
        description,
        priority,
        status: "open",
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserSupportTickets(): Promise<SupportTicket[]> {
    if (!this.userId) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  // ===== DASHBOARD STATS APIs =====
  async getDashboardStats() {
    if (!this.userId) throw new Error("User not authenticated")

    const [applications, notifications] = await Promise.all([
      this.getUserApplications(),
      this.getUnreadNotificationCount(),
    ])

    const stats = {
      totalApplications: applications.length,
      approved: applications.filter((app) => app.status === "approved").length,
      underReview: applications.filter((app) => app.status === "under-review").length,
      pending: applications.filter((app) => app.status === "pending").length,
      unreadNotifications: notifications,
    }

    return stats
  }

  // ===== AI SESSION APIs =====
  async createAISession(sessionType = "general"): Promise<string> {
    if (!this.userId) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("ai_sessions")
      .insert({
        user_id: this.userId,
        session_type: sessionType,
        status: "active",
      })
      .select("id")
      .single()

    if (error) throw error
    return data.id
  }

  async logAIInteraction(sessionId: string, prompt: string, response: string, model: string): Promise<void> {
    const { error } = await supabase
      .from("ai_sessions")
      .update({
        last_interaction: new Date().toISOString(),
        interaction_count: supabase.rpc("increment_interaction_count", { session_id: sessionId }),
      })
      .eq("id", sessionId)

    if (error) throw error
  }

  // ===== AUDIT LOG APIs =====
  async logUserAction(action: string, details: any): Promise<void> {
    if (!this.userId) return

    const { error } = await supabase.from("audit_logs").insert({
      user_id: this.userId,
      action_type: action,
      action_details: details,
      timestamp: new Date().toISOString(),
    })

    if (error) console.error("Failed to log action:", error)
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance()
