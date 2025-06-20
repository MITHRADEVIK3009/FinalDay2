import { type NextRequest, NextResponse } from "next/server"
import { translateWithAzure } from "@/lib/translation-service"

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, batch } = await request.json()

    if (!text && !batch) {
      return NextResponse.json({ success: false, error: "Text or batch is required" }, { status: 400 })
    }

    if (!targetLanguage) {
      return NextResponse.json({ success: false, error: "Target language is required" }, { status: 400 })
    }

    let result
    if (batch && Array.isArray(batch)) {
      // Batch translation
      const translations = await Promise.all(batch.map((item: string) => translateWithAzure(item, targetLanguage)))
      result = { translations }
    } else {
      // Single translation
      const translation = await translateWithAzure(text, targetLanguage)
      result = { translation }
    }

    return NextResponse.json({
      success: true,
      data: result,
      model: "azure-translator",
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ success: false, error: "Failed to translate text" }, { status: 500 })
  }
}
