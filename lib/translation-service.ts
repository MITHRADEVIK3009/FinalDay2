// ✅ Azure Translation Service
const AZURE_TRANSLATOR_KEY =
  process.env.AZURE_TRANSLATOR_KEY ||
  "BHAjEazjrDBcQkKK4snRZMmDw1i2ICM7QGoMjOD34kIsfASnYMgsJQQJ99BFAC3pKaRXJ3w3AAAbACOG5VNv"
const AZURE_TRANSLATOR_REGION = "eastasia"
const AZURE_TRANSLATOR_URL = "https://api.cognitive.microsofttranslator.com/translate"

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

  async translateWithAzure(text: string, targetLang: string): Promise<string> {
    const cacheKey = this.getCacheKey(text, targetLang)

    // Check cache first
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey]
    }

    try {
      const response = await fetch(`${AZURE_TRANSLATOR_URL}?api-version=3.0&to=${targetLang}`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY,
          "Ocp-Apim-Subscription-Region": AZURE_TRANSLATOR_REGION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ Text: text }]),
      })

      if (!response.ok) {
        throw new Error(`Azure Translator API error: ${response.status}`)
      }

      const data = await response.json()
      const translatedText = data[0]?.translations?.[0]?.text

      if (translatedText) {
        // Cache the translation
        this.cache[cacheKey] = translatedText
        this.saveCache()
        return translatedText
      }

      throw new Error("No translation received from Azure")
    } catch (error) {
      console.error("Azure translation failed:", error)
      return text // Return original text as fallback
    }
  }

  async translateBatch(texts: string[], targetLang: string): Promise<string[]> {
    try {
      const requestBody = texts.map((text) => ({ Text: text }))

      const response = await fetch(`${AZURE_TRANSLATOR_URL}?api-version=3.0&to=${targetLang}`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY,
          "Ocp-Apim-Subscription-Region": AZURE_TRANSLATOR_REGION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Azure Translator API error: ${response.status}`)
      }

      const data = await response.json()
      return data.map((item: any) => item.translations[0].text)
    } catch (error) {
      console.error("Azure batch translation failed:", error)
      return texts // Return original texts as fallback
    }
  }

  clearCache() {
    this.cache = {}
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.cacheKey)
    }
  }
}

export const translationService = new TranslationService()
export const translateWithAzure = (text: string, targetLang: string) =>
  translationService.translateWithAzure(text, targetLang)

// Export both for backward compatibility
export const translateWithGemini = translateWithAzure
