"use client"

import { useState, useRef, useCallback } from "react"
import { azureSpeechService } from "@/lib/azure-speech-service"

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcript, setTranscript] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" })

        try {
          // Use Azure Speech Services for STT
          const recognizedText = await azureSpeechService.speechToText(audioBlob, "en-US")
          setTranscript(recognizedText)
        } catch (error) {
          console.error("Speech recognition failed:", error)
          setTranscript("Could not recognize speech. Please try again.")
        }

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Failed to start recording:", error)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const speakText = useCallback(async (text: string, language = "en-US") => {
    try {
      // Use Azure Speech Services for TTS
      const voice = azureSpeechService.getVoiceForLanguage(language)
      const audioUrl = await azureSpeechService.textToSpeech(text, language, voice)

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => setIsPlaying(true)
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl) // Clean up blob URL
      }
      audio.onerror = () => setIsPlaying(false)

      await audio.play()
    } catch (error) {
      console.error("Failed to speak text:", error)
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }, [])

  return {
    isRecording,
    isPlaying,
    transcript,
    startRecording,
    stopRecording,
    speakText,
    stopSpeaking,
    clearTranscript: () => setTranscript(""),
  }
}
