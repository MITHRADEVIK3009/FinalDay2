"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { translateWithGemini } from "@/lib/translation-service"

interface LanguageContextType {
  currentLanguage: string
  changeLanguage: (lang: string) => Promise<void>
  translateText: (text: string, targetLang?: string) => Promise<string>
  isTranslating: boolean
  supportedLanguages: Array<{ code: string; name: string; nativeName: string }>
}

const supportedLanguages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
]

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en")
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("preferred_language")
    if (savedLanguage && savedLanguage !== currentLanguage) {
      changeLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = async (lang: string) => {
    try {
      setIsTranslating(true)

      // Change i18n language
      await i18n.changeLanguage(lang)

      // Update state
      setCurrentLanguage(lang)

      // Save to localStorage
      localStorage.setItem("preferred_language", lang)

      // Update user preference in database if user is logged in
      const userData = localStorage.getItem("user_data")
      if (userData) {
        const user = JSON.parse(userData)
        await updateUserLanguagePreference(user.id, lang)
      }

      // Update document language attribute
      document.documentElement.lang = lang
    } catch (error) {
      console.error("Failed to change language:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const translateText = async (text: string, targetLang?: string): Promise<string> => {
    const target = targetLang || currentLanguage
    if (target === "en") return text

    try {
      return await translateWithGemini(text, target)
    } catch (error) {
      console.error("Translation failed:", error)
      return text
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        translateText,
        isTranslating,
        supportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

async function updateUserLanguagePreference(userId: string, language: string) {
  try {
    await fetch("/api/users/language", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, language }),
    })
  } catch (error) {
    console.error("Failed to update user language preference:", error)
  }
}
