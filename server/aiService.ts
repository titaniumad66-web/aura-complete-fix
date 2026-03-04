import "dotenv/config"

type Memory = { image?: string; caption?: string | null }

type GenerateInput = {
  name: string
  relationship?: string
  theme?: string
  tone?: string
  memories?: Memory[]
}

type GenerateOutput = {
  message: string
  captions: string[]
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.AI_API_KEY
const OPENAI_BASE_URL = process.env.OPENAI_API_BASE || "https://api.openai.com/v1"
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"

function buildPrompt(input: GenerateInput) {
  const memCount = input.memories?.length ? `You have ${input.memories.length} memories.` : "No specific memories provided."
  const relationship = input.relationship || "Friend"
  const tone = input.tone || input.theme || "romantic"
  const nonce = Math.random().toString(36).slice(2)
  const userBlock = [
    `Name: ${input.name}`,
    `Relationship: ${relationship}`,
    `Theme: ${input.theme || "romantic"}`,
    `Tone: ${tone}`,
    memCount,
    `Unique directive: ${nonce}`,
  ].join("\n")

  const system = [
    "You are a creative birthday message writer.",
    "Generate a heartfelt birthday message tailored to the given relationship and tone.",
    "Avoid repeating phrases and make every message unique.",
    "Do not repeat previously generated text.",
    "Length: 120 to 200 words.",
    "Return strict JSON in the following shape:",
    `{"message": string, "captions": string[]}`,
    "Create short, optional memory captions if memories are provided. If none, return an empty array.",
  ].join("\n")

  const user = [
    userBlock,
    "Output only JSON. No markdown.",
  ].join("\n\n")

  return { system, user }
}

function extractJson(text: string): any {
  try {
    return JSON.parse(text)
  } catch {
    const start = text.indexOf("{")
    const end = text.lastIndexOf("}")
    if (start !== -1 && end !== -1 && end > start) {
      const slice = text.slice(start, end + 1)
      try {
        return JSON.parse(slice)
      } catch {
        return null
      }
    }
    return null
  }
}

export async function generateBirthdayContent(input: GenerateInput): Promise<GenerateOutput> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set")
  }
  const { system, user } = buildPrompt(input)

  const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.9,
      max_tokens: 500,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`AI request failed: ${res.status} ${errText}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content || ""
  const parsed = extractJson(content)
  const message = typeof parsed?.message === "string" ? parsed.message : content

  const captions: string[] = Array.isArray(parsed?.captions)
    ? parsed.captions.filter((c: any) => typeof c === "string")
    : []

  return { message, captions }
}
