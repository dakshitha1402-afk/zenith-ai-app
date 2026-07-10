export const runtime = "edge";

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy_build_key",
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ 
        text: "API Connection Error: Your OPENROUTER_API_KEY variable is missing on Vercel project settings!" 
      });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array provided" }, { status: 400 });
    }

    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role || "user",
      content: msg.content,
    }));

    const finalMessages = [
      {
        role: "system",
        content: "You are an empathetic conversational AI assistant for mental wellness. Respond only in plain paragraph text."
      },
      ...formattedMessages
    ];

    // FIX: Using the verified, completely free-tier OpenRouter model identifier
    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct:free", 
      messages: finalMessages,
      extra_headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
        "X-Title": "ZenithAI Dashboard",
      }
    });

    // Clean structural safely parsed fallback text check
    const textOutput = response.choices?.[0]?.message?.content || "";

    if (!textOutput || textOutput.trim() === "") {
      return NextResponse.json({ 
        text: "The free model connected successfully, but returned an empty response string. Please check your OpenRouter dashboard limits!" 
      });
    }

    return NextResponse.json({ text: textOutput });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown backend error";
    return NextResponse.json({ text: `API Connection Error: ${errorMessage}` });
  }
}
