"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
  MessageCircle,
  Languages,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { DEMO_USER } from "@/lib/demo-data"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  language?: string
}

// ✅ AI Assistant Terminal-like Interface
export default function AIAssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: `Hello! I'm your AI assistant. I can help you with government schemes, applications, and answer your questions in ${DEMO_USER.preferred_language}. How can I assist you today?`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [language, setLanguage] = useState(DEMO_USER.preferred_language)
  const [isDemoMode] = useState(() => localStorage.getItem("demo_mode") === "true")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ✅ Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ✅ Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // ✅ Send message handler with AI response
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // ✅ AI Response Logic
      let aiResponse = ""

      if (isDemoMode) {
        // ✅ Demo responses based on keywords
        aiResponse = getDemoResponse(inputMessage.toLowerCase())
      } else {
        // ✅ Real AI API call
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: inputMessage,
            language: language,
            userId: JSON.parse(localStorage.getItem("user_data") || "{}").id,
          }),
        })
        const data = await response.json()
        aiResponse = data.response
      }

      // ✅ Add AI response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        language: language,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // ✅ Text-to-speech for AI response
      if (language !== "English") {
        speakText(aiResponse)
      }
    } catch (error) {
      console.error("AI response error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Demo AI responses
  const getDemoResponse = (input: string): string => {
    if (input.includes("scheme") || input.includes("apply")) {
      return "I can help you find suitable government schemes! Based on your profile, you're eligible for housing schemes like PMAY, employment schemes like MGNREGA, and healthcare schemes like Medicaid. Would you like me to explain any specific scheme?"
    }
    if (input.includes("document") || input.includes("upload")) {
      return "For most government schemes, you'll need: Aadhaar card, income certificate, caste certificate (if applicable), bank passbook, and passport-size photos. I can help you understand which documents are needed for specific schemes."
    }
    if (input.includes("status") || input.includes("application")) {
      return "I can check your application status! You currently have 3 applications: 1 approved (PMAY), 1 under review (SNAP), and 1 pending (Medicaid). Would you like details about any specific application?"
    }
    if (input.includes("help") || input.includes("support")) {
      return "I'm here to help! I can assist with: finding eligible schemes, explaining application processes, checking document requirements, tracking application status, and answering questions about government services. What would you like to know?"
    }
    if (input.includes("language") || input.includes("hindi") || input.includes("tamil")) {
      return "I can communicate in multiple languages including English, Hindi, and Tamil. You can ask me questions in your preferred language and I'll respond accordingly. What language would you prefer?"
    }
    return "I understand your question. As your AI assistant, I'm here to help with government schemes, applications, and services. Could you please be more specific about what you'd like to know?"
  }

  // ✅ Voice recording handler
  const handleVoiceRecording = async () => {
    if (isRecording) {
      setIsRecording(false)
      // Stop recording logic
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setIsRecording(true)
        // Start recording logic - for demo, we'll simulate
        setTimeout(() => {
          setIsRecording(false)
          setInputMessage("What schemes am I eligible for?") // Simulated voice input
          stream.getTracks().forEach((track) => track.stop())
        }, 3000)
      } catch (error) {
        console.error("Microphone access denied:", error)
        alert("Microphone access is required for voice input")
      }
    }
  }

  // ✅ Text-to-speech handler
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "Hindi" ? "hi-IN" : language === "Tamil" ? "ta-IN" : "en-US"
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  // ✅ Stop speaking
  const stopSpeaking = () => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  // ✅ Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                <Bot className="h-3 w-3 mr-1" />
                AI Assistant
              </Badge>
              {isDemoMode && (
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  Demo Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* ✅ Language Selector */}
          <Card className="bg-slate-800/50 border-slate-700 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Language:</span>
                </div>
                <div className="flex space-x-2">
                  {["English", "Hindi", "Tamil"].map((lang) => (
                    <Button
                      key={lang}
                      variant={language === lang ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage(lang)}
                      className={language === lang ? "bg-purple-500 hover:bg-purple-600" : ""}
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Chat Messages */}
          <Card className="bg-slate-800/50 border-slate-700 flex-1 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-purple-400" />
                <span>AI Government Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* ✅ Messages Area */}
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === "user" ? "bg-teal-500/20 text-teal-400" : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === "user"
                            ? "bg-teal-500/20 text-teal-100 ml-auto"
                            : "bg-slate-700/50 text-slate-100"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-60 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                      {message.type === "assistant" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakText(message.content)}
                          className="text-slate-400 hover:text-white"
                        >
                          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                          <span className="text-sm text-slate-300">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* ✅ Input Area */}
              <div className="border-t border-slate-700 p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Type your message in ${language}...`}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-12"
                      disabled={isLoading}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleVoiceRecording}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                        isRecording ? "text-red-400 animate-pulse" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>

                {/* ✅ Quick Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    "What schemes am I eligible for?",
                    "Check my application status",
                    "What documents do I need?",
                    "Help me apply for housing scheme",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(suggestion)}
                      className="text-xs border-slate-600 text-slate-400 hover:text-white hover:border-slate-500"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
