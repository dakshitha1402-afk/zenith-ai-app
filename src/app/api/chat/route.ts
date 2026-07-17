export const runtime = "edge";

import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    // Verify API key exists
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          text: "Configuration Error: GROQ_API_KEY is missing in Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          text: "Invalid request: messages array required.",
        },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are ZenithAI, an empathetic conversational AI assistant for mental wellness. Respond naturally in plain text without markdown formatting unless explicitly requested.",
        },
        ...messages,
      ],
    });

    const responseText =
      completion.choices?.[0]?.message?.content ||
      "I couldn't generate a response.";

    return NextResponse.json({
      text: responseText,
    });
  } catch (error: any) {
    console.error("Groq API Error:", error);

    return NextResponse.json(
      {
        text: `API Connection Error: ${
          error?.message || "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
