import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
// Import XAI service
import { xaiService } from "@/lib/xai-service"

const bodySchema = z.object({
  documentType: z.string(),
  content: z.string(),
  language: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { documentType, content, language } = bodySchema.parse(body)

    // Update the analysis function to use real XAI analysis
    const analysis = await xaiService.analyzeDocument(documentType, content, language || "en")

    // Update the response
    return NextResponse.json({
      success: true,
      data: { analysis },
      model: "grok-beta",
    })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 })
    }

    console.error(e)
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
