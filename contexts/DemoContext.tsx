"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface DemoOfficer {
  id: string
  name: string
  employeeId: string
  email: string
  phone: string
  department: string
  role: string
  designation: string
  district: string
  office: string
  isDemoOfficer: boolean
  preferred_language: string
  status: string
}

interface DemoUser {
  id: string
  name: string
  phone: string
  aadhaar: string
  email: string
  isDemoUser: boolean
  preferred_language: string
}

interface DemoContextType {
  isDemoMode: boolean
  toggleDemoMode: () => void
  setDemoMode: (enabled: boolean) => void
  demoOfficer: DemoOfficer | null
  setDemoOfficer: (officer: DemoOfficer | null) => void
  demoUser: DemoUser | null
  setDemoUser: (user: DemoUser | null) => void
  createDemoUser: () => DemoUser
  createDemoOfficer: () => DemoOfficer
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoOfficer, setDemoOfficer] = useState<DemoOfficer | null>(null)
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)

  // Load demo mode state from localStorage on mount
  useEffect(() => {
    const savedDemoMode = localStorage.getItem("demo_mode")
    const savedDemoOfficer = localStorage.getItem("demo_officer_data")
    const savedDemoUser = localStorage.getItem("demo_user_data")

    if (savedDemoMode === "true") {
      setIsDemoMode(true)
    }

    if (savedDemoOfficer) {
      try {
        setDemoOfficer(JSON.parse(savedDemoOfficer))
      } catch (e) {
        console.error("Failed to parse demo officer data:", e)
      }
    }

    if (savedDemoUser) {
      try {
        setDemoUser(JSON.parse(savedDemoUser))
      } catch (e) {
        console.error("Failed to parse demo user data:", e)
      }
    }
  }, [])

  const toggleDemoMode = () => {
    const newDemoMode = !isDemoMode
    setIsDemoMode(newDemoMode)
    localStorage.setItem("demo_mode", newDemoMode.toString())

    if (!newDemoMode) {
      // Clear demo data when exiting demo mode
      setDemoOfficer(null)
      setDemoUser(null)
      localStorage.removeItem("demo_officer_data")
      localStorage.removeItem("demo_user_data")
      localStorage.removeItem("demo_officer_token")
      localStorage.removeItem("demo_user_token")
    }
  }

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled)
    localStorage.setItem("demo_mode", enabled.toString())
  }

  const createDemoUser = (): DemoUser => {
    const demoUser: DemoUser = {
      id: "demo-user-001",
      name: "Muthu Selvam",
      phone: "+91 9876543210",
      aadhaar: "1234-5678-9012",
      email: "muthu.selvam@example.com",
      isDemoUser: true,
      preferred_language: "en",
    }

    setDemoUser(demoUser)
    localStorage.setItem("demo_user_data", JSON.stringify(demoUser))
    return demoUser
  }

  const createDemoOfficer = (): DemoOfficer => {
    const demoOfficer: DemoOfficer = {
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
      isDemoOfficer: true,
      preferred_language: "en",
      status: "active",
    }

    setDemoOfficer(demoOfficer)
    localStorage.setItem("demo_officer_data", JSON.stringify(demoOfficer))
    return demoOfficer
  }

  const handleSetDemoOfficer = (officer: DemoOfficer | null) => {
    setDemoOfficer(officer)
    if (officer) {
      localStorage.setItem("demo_officer_data", JSON.stringify(officer))
    } else {
      localStorage.removeItem("demo_officer_data")
    }
  }

  const handleSetDemoUser = (user: DemoUser | null) => {
    setDemoUser(user)
    if (user) {
      localStorage.setItem("demo_user_data", JSON.stringify(user))
    } else {
      localStorage.removeItem("demo_user_data")
    }
  }

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        setDemoMode,
        demoOfficer,
        setDemoOfficer: handleSetDemoOfficer,
        demoUser,
        setDemoUser: handleSetDemoUser,
        createDemoUser,
        createDemoOfficer,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider")
  }
  return context
}
