import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface CitizenProfile {
  id: string
  user_id: string
  name: string
  phone: string
  aadhaar?: string
  age?: number
  date_of_birth?: string
  caste?: string
  father_name?: string
  mother_name?: string
  district?: string
  block?: string
  village?: string
  pincode?: string
  preferred_language: "ta" | "hi" | "en"
  voice_enabled: boolean
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  user_id: string
  scheme_id: string
  status: "pending" | "under-review" | "approved" | "rejected"
  progress: number
  created_at: string
  updated_at: string
  documents?: Document[]
}

export interface Scheme {
  id: string
  title: string
  description: string
  department: string
  category: string
  country: string
  eligibility_criteria: any
  required_documents: string[]
  amount?: string
  deadline?: string
  status: "active" | "inactive"
  created_at: string
}

export interface Document {
  id: string
  application_id: string
  filename: string
  file_path: string
  document_type: string
  status: "pending" | "verified" | "rejected"
  uploaded_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "success" | "warning" | "info" | "error"
  read: boolean
  created_at: string
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  created_at: string
}
