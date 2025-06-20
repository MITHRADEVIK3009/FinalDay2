// ✅ Azure Speech Services
const AZURE_SPEECH_KEY =
  process.env.AZURE_SPEECH_KEY || "A2raZeZyKBuqGUyBE9qEczu4bgGszz4OXOmCz0HZYgqsBiAvg54jJQQJ99BFAC3pKaRXJ3w3AAAYACOGVbn8"
const AZURE_SPEECH_REGION = "eastasia"
const AZURE_SPEECH_ENDPOINT = "https://eastasia.api.cognitive.microsoft.com"

class AzureSpeechService {
  // Convert speech to text
  async speechToText(audioBlob: Blob, language = "en-US"): Promise<string> {
    try {
      // Convert blob to WAV format if needed
      const wavBlob = await this.convertToWav(audioBlob)

      const response = await fetch(`${AZURE_SPEECH_ENDPOINT}/speech/v1.0/recognize`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
          "Content-Type": "audio/wav",
          Accept: "application/json",
        },
        body: wavBlob,
      })

      if (!response.ok) {
        throw new Error(`Azure Speech API error: ${response.status}`)
      }

      const data = await response.json()
      return data.DisplayText || data.RecognitionStatus || "Could not recognize speech"
    } catch (error) {
      console.error("Speech to text failed:", error)
      throw error
    }
  }

  // Convert text to speech
  async textToSpeech(text: string, language = "en-US", voice = "en-US-JennyNeural"): Promise<string> {
    try {
      const ssml = `
        <speak version='1.0' xml:lang='${language}'>
          <voice xml:lang='${language}' name='${voice}'>
            ${text}
          </voice>
        </speak>
      `

      const response = await fetch(`${AZURE_SPEECH_ENDPOINT}/speech/v1.0/synthesize`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        },
        body: ssml,
      })

      if (!response.ok) {
        throw new Error(`Azure TTS API error: ${response.status}`)
      }

      const audioBuffer = await response.arrayBuffer()
      const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" })
      return URL.createObjectURL(audioBlob)
    } catch (error) {
      console.error("Text to speech failed:", error)
      throw error
    }
  }

  // Convert audio blob to WAV format
  private async convertToWav(audioBlob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const fileReader = new FileReader()

      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

          // Convert to WAV
          const wavBuffer = this.audioBufferToWav(audioBuffer)
          const wavBlob = new Blob([wavBuffer], { type: "audio/wav" })
          resolve(wavBlob)
        } catch (error) {
          reject(error)
        }
      }

      fileReader.onerror = reject
      fileReader.readAsArrayBuffer(audioBlob)
    })
  }

  // Convert AudioBuffer to WAV format
  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length
    const numberOfChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2)
    const view = new DataView(arrayBuffer)

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, "RIFF")
    view.setUint32(4, 36 + length * numberOfChannels * 2, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numberOfChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numberOfChannels * 2, true)
    view.setUint16(32, numberOfChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, "data")
    view.setUint32(40, length * numberOfChannels * 2, true)

    // Convert float samples to 16-bit PCM
    let offset = 44
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]))
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
        offset += 2
      }
    }

    return arrayBuffer
  }

  // Get available voices for different languages
  getVoiceForLanguage(language: string): string {
    const voices: { [key: string]: string } = {
      "en-US": "en-US-JennyNeural",
      "ta-IN": "ta-IN-PallaviNeural",
      "hi-IN": "hi-IN-SwaraNeural",
      "te-IN": "te-IN-ShrutiNeural",
      "fr-FR": "fr-FR-DeniseNeural",
      "de-DE": "de-DE-KatjaNeural",
    }
    return voices[language] || voices["en-US"]
  }
}

export const azureSpeechService = new AzureSpeechService()
