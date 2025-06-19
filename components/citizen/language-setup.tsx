"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Volume2, Mic, Eye, Type } from "lucide-react"
import { useRouter } from "next/navigation"

export function LanguageSetup() {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [accessibilityOptions, setAccessibilityOptions] = useState<string[]>([])

  const languages = [
    { code: "ta", name: "தமிழ்", english: "Tamil" },
    { code: "hi", name: "हिंदी", english: "Hindi" },
    { code: "en", name: "English", english: "English" },
  ]

  const accessibilityFeatures = [
    { id: "voice", label: "Voice Navigation", icon: Volume2 },
    { id: "large-text", label: "Large Text", icon: Type },
    { id: "high-contrast", label: "High Contrast", icon: Eye },
    { id: "voice-input", label: "Voice Input", icon: Mic },
  ]

  const handleContinue = () => {
    // Save preferences to localStorage or context
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({
        language: selectedLanguage,
        voiceEnabled,
        accessibilityOptions,
      }),
    )
    router.push("/citizen/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Badge variant="secondary" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
              Step 1 of 3
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Language & Accessibility Setup</h1>
            <p className="text-slate-300">
              Choose your preferred language and accessibility options for the best experience
            </p>
          </div>

          {/* Language Selection */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Select Your Language</CardTitle>
              <CardDescription className="text-slate-400">
                Choose your preferred language for the interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLanguage === lang.code
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                    onClick={() => setSelectedLanguage(lang.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{lang.name}</h3>
                        <p className="text-sm text-slate-400">{lang.english}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedLanguage === lang.code ? "border-yellow-500 bg-yellow-500" : "border-slate-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Voice Features */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Voice Features</CardTitle>
              <CardDescription className="text-slate-400">
                Enable voice assistance for hands-free interaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  voiceEnabled ? "border-teal-500 bg-teal-500/10" : "border-slate-600 hover:border-slate-500"
                }`}
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="h-5 w-5 text-teal-400" />
                    <div>
                      <h3 className="font-semibold text-white">Enable Voice Assistant</h3>
                      <p className="text-sm text-slate-400">Get spoken guidance and use voice commands</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      voiceEnabled ? "border-teal-500 bg-teal-500" : "border-slate-500"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Options */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Accessibility Options</CardTitle>
              <CardDescription className="text-slate-400">Select features to improve your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {accessibilityFeatures.map((feature) => {
                  const Icon = feature.icon
                  const isSelected = accessibilityOptions.includes(feature.id)

                  return (
                    <div
                      key={feature.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected ? "border-yellow-500 bg-yellow-500/10" : "border-slate-600 hover:border-slate-500"
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setAccessibilityOptions((prev) => prev.filter((id) => id !== feature.id))
                        } else {
                          setAccessibilityOptions((prev) => [...prev, feature.id])
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4 text-yellow-400" />
                          <span className="text-white">{feature.label}</span>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full border ${
                            isSelected ? "border-yellow-500 bg-yellow-500" : "border-slate-500"
                          }`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="text-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedLanguage}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-8"
            >
              Continue to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
