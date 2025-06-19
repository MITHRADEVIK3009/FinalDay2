"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, HelpCircle } from "lucide-react"
import { useVoice } from "@/hooks/use-voice"
import { explainRejectionReason, autofillFormFields } from "@/lib/api-client"

interface VoiceAssistantProps {
  userId: string
  language: string
  onTranscript?: (text: string) => void
}

export function VoiceAssistant({ userId, language, onTranscript }: VoiceAssistantProps) {
  const {
    isRecording,
    isPlaying,
    transcript,
    startRecording,
    stopRecording,
    speakText,
    stopSpeaking,
    clearTranscript,
  } = useVoice()
  const [aiResponse, setAiResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true)

    try {
      // Voice command processing logic
      if (command.toLowerCase().includes("help me fill form")) {
        const response = await autofillFormFields(userId, "current-scheme-id")
        if (response.success) {
          const message = "I've helped fill out your form with the available information."
          setAiResponse(message)
          await speakText(message, language)
        }
      } else if (command.toLowerCase().includes("why was this rejected")) {
        const response = await explainRejectionReason("current-application-id")
        if (response.success && response.data) {
          setAiResponse(response.data.explanation)
          await speakText(response.data.explanation, language)
        }
      } else {
        // General AI response
        const message = `I heard: "${command}". How can I help you with government services?`
        setAiResponse(message)
        await speakText(message, language)
      }
    } catch (error) {
      const errorMessage = "Sorry, I couldn't process that request. Please try again."
      setAiResponse(errorMessage)
      await speakText(errorMessage, language)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRecordingComplete = () => {
    if (transcript) {
      onTranscript?.(transcript)
      handleVoiceCommand(transcript)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>AI Voice Assistant</span>
        </CardTitle>
        <CardDescription className="text-purple-200">
          Speak naturally in {language === "ta" ? "Tamil" : language === "hi" ? "Hindi" : "English"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`${
              isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
            size="lg"
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>

          <Button
            onClick={isPlaying ? stopSpeaking : () => speakText(aiResponse, language)}
            disabled={!aiResponse || isProcessing}
            variant="outline"
            className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
          >
            {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isPlaying ? "Stop" : "Repeat"}
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center space-x-2">
          {isRecording && (
            <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
              Recording...
            </Badge>
          )}
          {isProcessing && (
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Processing...
            </Badge>
          )}
          {isPlaying && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              Speaking...
            </Badge>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
            <p className="text-sm text-slate-400 mb-1">You said:</p>
            <p className="text-white">{transcript}</p>
          </div>
        )}

        {/* AI Response */}
        {aiResponse && (
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <p className="text-sm text-purple-400 mb-1">AI Assistant:</p>
            <p className="text-white">{aiResponse}</p>
          </div>
        )}

        {/* Quick Voice Commands */}
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Try saying:</p>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-left text-purple-300 hover:bg-purple-500/20"
              onClick={() => handleVoiceCommand("Help me fill form")}
            >
              "Help me fill the form"
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-left text-purple-300 hover:bg-purple-500/20"
              onClick={() => handleVoiceCommand("Why was this rejected")}
            >
              "Why was my application rejected?"
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-left text-purple-300 hover:bg-purple-500/20"
              onClick={() => handleVoiceCommand("What documents do I need")}
            >
              "What documents do I need?"
            </Button>
          </div>
        </div>

        {/* Responsible AI Info */}
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <HelpCircle className="h-3 w-3" />
          <span>AI responses are generated to help you. Always verify important information.</span>
        </div>
      </CardContent>
    </Card>
  )
}
