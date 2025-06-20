// ✅ Azure OpenAI Service
const AZURE_OPENAI_KEY =
  process.env.AZURE_OPENAI_KEY || "8vpTD9G4fdM9XArShD2VOaPbf8xpsgS0qeYbCGE9uMj9Fnqkk1UhJQQJ99BFACqBBLyXJ3w3AAABACOG5OEX"
const AZURE_OPENAI_ENDPOINT = "https://mschallengiy.openai.azure.com"
const AZURE_OPENAI_DEPLOYMENT = "gpt-4" // You may need to adjust this based on your deployment name

interface AzureOpenAIMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface AzureOpenAIResponse {
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

class AzureOpenAIService {
  async chatCompletion(messages: AzureOpenAIMessage[], temperature = 0.7, maxTokens = 2000): Promise<string> {
    try {
      const response = await fetch(
        `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview`,
        {
          method: "POST",
          headers: {
            "api-key": AZURE_OPENAI_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            temperature,
            max_tokens: maxTokens,
            stream: false,
          }),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Azure OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data: AzureOpenAIResponse = await response.json()
      return data.choices[0]?.message?.content || "No response generated"
    } catch (error) {
      console.error("Azure OpenAI API call failed:", error)
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

    const messages: AzureOpenAIMessage[] = [
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

    const messages: AzureOpenAIMessage[] = [
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

    const messages: AzureOpenAIMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]

    return await this.chatCompletion(messages, 0.6, 1000)
  }

  async chatWithAssistant(userMessage: string, context: any, history: AzureOpenAIMessage[] = []): Promise<string> {
    const systemPrompt = `You are an advanced AI assistant for Tamil Nadu Digital Services.
    You help both citizens and government officers with:
    - Government scheme information and guidance
    - Application assistance and troubleshooting  
    - Document requirements and procedures
    - Policy clarifications and interpretations
    - General support and problem-solving
    
    Be intelligent, helpful, and professional. Always provide accurate information.`

    const messages: AzureOpenAIMessage[] = [
      { role: "system", content: systemPrompt },
      ...history.slice(-8), // Keep last 8 messages for context
      { role: "user", content: userMessage },
    ]

    return await this.chatCompletion(messages, 0.7, 1200)
  }
}

export const azureOpenAIService = new AzureOpenAIService()
