// ✅ Translation Service using Gemini API
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "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"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

interface TranslationCache {
  [key: string]: string
}

class TranslationService {
  private cache: TranslationCache = {}
  private cacheKey = "translation_cache"

  constructor() {
    this.loadCache()
  }

  private loadCache() {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(this.cacheKey)
      if (cached) {
        this.cache = JSON.parse(cached)
      }
    }
  }

  private saveCache() {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.cacheKey, JSON.stringify(this.cache))
    }
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${targetLang}:${text.substring(0, 100)}`
  }

  async translateWithGemini(text: string, targetLang: string): Promise<string> {
    const cacheKey = this.getCacheKey(text, targetLang)

    // Check cache first
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey]
    }

    try {
      const languageNames = {
        ta: "Tamil",
        hi: "Hindi",
        te: "Telugu",
        fr: "French",
        de: "German",
        en: "English",
      }

      const prompt = `Translate the following text to ${languageNames[targetLang as keyof typeof languageNames] || targetLang}. Only return the translated text, no explanations:

${text}`

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

      if (translatedText) {
        // Cache the translation
        this.cache[cacheKey] = translatedText
        this.saveCache()
        return translatedText
      }

      throw new Error("No translation received from Gemini")
    } catch (error) {
      console.error("Gemini translation failed:", error)
      return text // Return original text as fallback
    }
  }

  async translateBatch(texts: string[], targetLang: string): Promise<string[]> {
    const translations = await Promise.all(texts.map((text) => this.translateWithGemini(text, targetLang)))
    return translations
  }

  clearCache() {
    this.cache = {}
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.cacheKey)
    }
  }
}

export const translationService = new TranslationService()
export const translateWithGemini = (text: string, targetLang: string) =>
  translationService.translateWithGemini(text, targetLang)
