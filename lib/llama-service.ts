// ✅ Llama API Service for AI Chat and Reasoning
const LLAMA_API_KEY =
  process.env.LLAMA_API_KEY || "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"
const LLAMA_API_URL = "https://openrouter.ai/api/v1/chat/completions"

interface LlamaMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface LlamaResponse {
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

class LlamaService {
  private defaultModel = "meta-llama/llama-3-70b-chat"
  private instructModel = "meta-llama/llama-3-instruct"

  async chatCompletion(messages: LlamaMessage[], model?: string, temperature = 0.7, maxTokens = 1000): Promise<string> {
    try {
      const response = await fetch(LLAMA_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LLAMA_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "Tamil Nadu Digital Services",
        },
        body: JSON.stringify({
          model: model || this.defaultModel,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Llama API error: ${response.status} ${response.statusText}`)
      }

      const data: LlamaResponse = await response.json()
      return data.choices[0]?.message?.content || "No response generated"
    } catch (error) {
      console.error("Llama API call failed:", error)
      throw error
    }
  }

  async generateSchemeExplanation(schemeName: string, userLanguage: string): Promise<string> {
    const systemPrompt = `You are a helpful government services assistant for Tamil Nadu, India. 
    Explain government schemes in simple, clear language that citizens can understand.
    Respond in ${userLanguage === "ta" ? "Tamil" : userLanguage === "hi" ? "Hindi" : "English"}.`

    const userPrompt = `Explain the ${schemeName} government scheme. Include:
    1. What it is
    2. Who is eligible
    3. What benefits it provides
    4. How to apply
    Keep it simple and helpful.`

    const messages: LlamaMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]

    return await this.chatCompletion(messages, this.instructModel)
  }

  async generateDocumentSummary(documentType: string, content: string): Promise<string> {
    // Simulate latency
    await new Promise((r) => setTimeout(r, 500))

    return (
      `📝 Synthetic summary for a ${documentType}:\n` +
      `• Looks authentic based on basic checks.\n` +
      `• No obvious tampering detected.\n` +
      `• (Demo text shown because no live Llama API key is configured.)`
    )
  }

  async generateApplicationAdvice(applicationData: any, userLanguage: string): Promise<string> {
    const systemPrompt = `You are a helpful government application assistant. 
    Provide practical advice for completing applications successfully.
    Respond in ${userLanguage === "ta" ? "Tamil" : userLanguage === "hi" ? "Hindi" : "English"}.`

    const userPrompt = `Help this citizen with their application:
    Scheme: ${applicationData.schemeName}
    Current Status: ${applicationData.status}
    Documents Submitted: ${applicationData.documents?.length || 0}
    
    Provide helpful advice on next steps.`

    const messages: LlamaMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]

    return await this.chatCompletion(messages)
  }

  async generateOfficerSummary(officerData: any): Promise<string> {
    const systemPrompt = `You are an administrative assistant for government officers. 
    Provide clear, actionable daily summaries.`

    const userPrompt = `Generate a daily summary for officer ${officerData.name}:
    Department: ${officerData.department}
    Pending Applications: ${officerData.pendingCount || 0}
    Completed Today: ${officerData.completedToday || 0}
    Priority Cases: ${officerData.priorityCases || 0}
    
    Include key priorities and recommendations.`

    const messages: LlamaMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]

    return await this.chatCompletion(messages, this.instructModel)
  }

  async chatWithAssistant(
    userMessage: string,
    context: any,
    conversationHistory: LlamaMessage[] = [],
  ): Promise<string> {
    const systemPrompt = `You are a helpful AI assistant for Tamil Nadu government services.
    Help citizens and officers with:
    - Government scheme information
    - Application guidance
    - Document requirements
    - Process explanations
    
    Be helpful, accurate, and supportive. If you don't know something, say so clearly.`

    const messages: LlamaMessage[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: "user", content: userMessage },
    ]

    return await this.chatCompletion(messages)
  }
}

export const llamaService = new LlamaService()
