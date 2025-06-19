// ✅ Enhanced AI Client with Real XAI and Gemini Integration
import { xaiService } from "./xai-service"
import { translationService } from "./translation-service"

export interface AIAnalysisResponse {
  success: boolean
  data: {
    analysis: string
    confidence: number
    recommendations: string[]
    riskLevel: "LOW" | "MEDIUM" | "HIGH"
  }
  model: string
}

export interface AIInsightsResponse {
  success: boolean
  data: {
    insights: string
    priorities: string[]
    recommendations: string[]
    workloadScore: number
  }
  model: string
}

export class EnhancedAIClient {
  async analyzeDocumentWithAI(documentType: string, content: string, language = "en"): Promise<AIAnalysisResponse> {
    try {
      const analysis = await xaiService.analyzeDocument(documentType, content, language)

      // Parse the analysis to extract structured data
      const confidence = this.extractConfidence(analysis)
      const recommendations = this.extractRecommendations(analysis)
      const riskLevel = this.assessRiskLevel(analysis)

      return {
        success: true,
        data: {
          analysis,
          confidence,
          recommendations,
          riskLevel,
        },
        model: "grok-beta",
      }
    } catch (error) {
      console.error("AI document analysis failed:", error)
      return {
        success: false,
        data: {
          analysis: "Analysis failed. Please try again or contact support.",
          confidence: 0,
          recommendations: ["Manual review required"],
          riskLevel: "HIGH",
        },
        model: "error",
      }
    }
  }

  async generateOfficerInsights(officerData: any, applications: any[]): Promise<AIInsightsResponse> {
    try {
      const insights = await xaiService.generateOfficerInsights(officerData, applications)

      const priorities = this.extractPriorities(insights)
      const recommendations = this.extractActionItems(insights)
      const workloadScore = this.calculateWorkloadScore(applications)

      return {
        success: true,
        data: {
          insights,
          priorities,
          recommendations,
          workloadScore,
        },
        model: "grok-beta",
      }
    } catch (error) {
      console.error("AI insights generation failed:", error)
      return {
        success: false,
        data: {
          insights: "Unable to generate insights at this time.",
          priorities: [],
          recommendations: ["Review applications manually"],
          workloadScore: 50,
        },
        model: "error",
      }
    }
  }

  async translateAndAnalyze(text: string, targetLanguage: string): Promise<string> {
    try {
      if (targetLanguage === "en") return text
      return await translationService.translateWithGemini(text, targetLanguage)
    } catch (error) {
      console.error("Translation failed:", error)
      return text
    }
  }

  async generateSchemeRecommendations(userProfile: any, language = "en"): Promise<string> {
    try {
      return await xaiService.generateSchemeRecommendations(userProfile, language)
    } catch (error) {
      console.error("Scheme recommendations failed:", error)
      return "Unable to generate recommendations at this time. Please contact support."
    }
  }

  async answerQuery(query: string, context: any, language = "en"): Promise<string> {
    try {
      return await xaiService.answerCitizenQuery(query, context, language)
    } catch (error) {
      console.error("Query answering failed:", error)
      return "I'm sorry, I couldn't process your query right now. Please try again or contact support."
    }
  }

  // Helper methods for parsing AI responses
  private extractConfidence(analysis: string): number {
    const confidenceMatch = analysis.match(/confidence[:\s]*(\d+(?:\.\d+)?)/i)
    return confidenceMatch ? Number.parseFloat(confidenceMatch[1]) : 85
  }

  private extractRecommendations(analysis: string): string[] {
    const lines = analysis.split("\n")
    const recommendations = lines
      .filter((line) => line.includes("recommend") || line.includes("suggest") || line.includes("should"))
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 5)

    return recommendations.length > 0 ? recommendations : ["Review manually", "Verify documents", "Check compliance"]
  }

  private assessRiskLevel(analysis: string): "LOW" | "MEDIUM" | "HIGH" {
    const lowerAnalysis = analysis.toLowerCase()
    if (lowerAnalysis.includes("high risk") || lowerAnalysis.includes("reject") || lowerAnalysis.includes("fraud")) {
      return "HIGH"
    }
    if (
      lowerAnalysis.includes("medium risk") ||
      lowerAnalysis.includes("caution") ||
      lowerAnalysis.includes("verify")
    ) {
      return "MEDIUM"
    }
    return "LOW"
  }

  private extractPriorities(insights: string): string[] {
    const lines = insights.split("\n")
    return lines
      .filter((line) => line.includes("priority") || line.includes("urgent") || line.includes("important"))
      .map((line) => line.trim())
      .slice(0, 3)
  }

  private extractActionItems(insights: string): string[] {
    const lines = insights.split("\n")
    return lines
      .filter((line) => line.includes("action") || line.includes("next") || line.includes("should"))
      .map((line) => line.trim())
      .slice(0, 5)
  }

  private calculateWorkloadScore(applications: any[]): number {
    const pending = applications.filter((app) => app.status === "pending").length
    const total = applications.length
    const urgentCount = applications.filter((app) => app.priority === "urgent").length

    // Calculate score based on workload (0-100)
    const pendingRatio = total > 0 ? (pending / total) * 100 : 0
    const urgentWeight = urgentCount * 10

    return Math.min(100, Math.max(0, pendingRatio + urgentWeight))
  }
}

export const enhancedAIClient = new EnhancedAIClient()
