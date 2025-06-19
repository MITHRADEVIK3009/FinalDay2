// ✅ XAI (Grok) Service for Advanced AI Features
const XAI_API_KEY =
  process.env.XAI_API_KEY || "xai-lfOTEEtE8TLo6t9fDHvTVLaFAmxNtbq18S7fDv9DR0CYmTnuWf58E6CJuC88qWsno0WYR53TuqY9Wj6B"
const XAI_API_URL = "https://api.x.ai/v1/chat/completions"

interface XAIMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface XAIResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

class XAIService {
  private defaultModel = "grok-beta"

  async chatCompletion(messages: XAIMessage[], temperature = 0.7, maxTokens = 2000): Promise<string> {
    try {
      const response = await fetch(XAI_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${XAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`XAI API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data: XAIResponse = await response.json()
      return data.choices[0]?.message?.content || "No response generated"
    } catch (error) {
      console.error("XAI API call failed:", error)
      throw error
    }
  }

  async analyzeDocument(documentType: string, content: string, language = "en"): Promise<string> {
    const systemPrompt = `You are an expert document analyst for Tamil Nadu government services. 
    Analyze documents for authenticity, completeness, and compliance with government standards.
    Provide detailed, actionable feedback in ${language === "ta" ? "Tamil" : language === "hi" ? "Hindi" : "English"}.`

    const userPrompt = `Analyze this ${documentType} document:
    
    Content: ${content}
    
    Please provide:
    1. Document authenticity assessment
    2. Completeness check
    3. Compliance verification
    4. Risk assessment
    5. Recommendations for approval/rejection
    6. Any red flags or concerns
    
    Be thorough and professional in your analysis.`

    const messages: XAIMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]

    return await this.chatCompletion(messages, 0.3, 1500)
  }

  async generateOfficerInsights(officerData: any, applications: any[]): Promise<string> {
    const systemPrompt = `You are an AI assistant for government officers in Tamil Nadu. 
    Provide intelligent insights, recommendations, and priority suggestions based on workload and application data.`

    const userPrompt = `Generate insights for Officer ${officerData.name}:
    
    Department: ${officerData.department}
    Current Workload: ${applications.length} applications
    Pending Applications: ${applications.filter((app) => app.status === "pending").length}
    Completed Today: ${applications.filter((app) => app.completedToday).length}
    
    Application Types:
    ${applications.map((app) => `- ${app.type}: ${app.status} (Priority: ${app.priority})`).join("\n")}
    
    Please provide:
    1. Priority recommendations
    2. Workload optimization suggestions
    3. Potential bottlenecks identification
    4. Performance insights
    5. Next actions recommendations
    
    Be specific and actionable.`

    const messages: XAIMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]

    return await this.chatCompletion(messages, 0.5, 1200)
  }

  async answerCitizenQuery(query: string, context: any, language = "en"): Promise<string> {
    const systemPrompt = `You are a helpful AI assistant for Tamil Nadu government services.
    Help citizens with accurate information about schemes, applications, and procedures.
    Always be helpful, accurate, and empathetic. Respond in ${language === "ta" ? "Tamil" : language === "hi" ? "Hindi" : "English"}.`

    const userPrompt = `Citizen Query: ${query}
    
    Context: ${JSON.stringify(context, null, 2)}
    
    Please provide a helpful, accurate response that:
    1. Directly answers their question
    2. Provides relevant additional information
    3. Suggests next steps if applicable
    4. Is easy to understand
    5. Shows empathy and support`

    const messages: XAIMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]

    return await this.chatCompletion(messages, 0.6, 1000)
  }

  async generateSchemeRecommendations(userProfile: any, language = "en"): Promise<string> {
    const systemPrompt = `You are an expert on Tamil Nadu government schemes and benefits.
    Analyze user profiles and recommend the most suitable schemes they should apply for.
    Respond in ${language === "ta" ? "Tamil" : language === "hi" ? "Hindi" : "English"}.`

    const userPrompt = `User Profile:
    Age: ${userProfile.age}
    Income: ${userProfile.income}
    Category: ${userProfile.category}
    Location: ${userProfile.location}
    Family Size: ${userProfile.familySize}
    Employment: ${userProfile.employment}
    Education: ${userProfile.education}
    
    Please recommend:
    1. Top 5 most suitable schemes
    2. Eligibility explanation for each
    3. Benefits they would receive
    4. Application priority order
    5. Required documents
    6. Expected processing time
    
    Be specific and prioritize high-impact schemes.`

    const messages: XAIMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]

    return await this.chatCompletion(messages, 0.4, 1500)
  }

  async chatWithAssistant(userMessage: string, context: any, history: XAIMessage[] = []): Promise<string> {
    const systemPrompt = `You are Grok, an advanced AI assistant for Tamil Nadu Digital Services.
    You help both citizens and government officers with:
    - Government scheme information and guidance
    - Application assistance and troubleshooting  
    - Document requirements and procedures
    - Policy clarifications and interpretations
    - General support and problem-solving
    
    Be intelligent, helpful, and slightly witty when appropriate. Always provide accurate information.`

    const messages: XAIMessage[] = [
      { role: "system", content: systemPrompt },
      ...history.slice(-8), // Keep last 8 messages for context
      { role: "user", content: userMessage },
    ]

    return await this.chatCompletion(messages, 0.7, 1200)
  }
}

export const xaiService = new XAIService()
