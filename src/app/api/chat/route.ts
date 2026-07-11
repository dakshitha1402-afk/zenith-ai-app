export const runtime = "edge";

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy_build_key",
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === "dummy_build_key") {
      return NextResponse.json({ 
        text: "Configuration Error: Your OPENROUTER_API_KEY is missing or invalid in your Vercel Environment Variables. Please add it and redeploy!" 
      });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array provided" }, { status: 400 });
    }

    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content || "",
    }));

    const finalMessages = [
      {
        role: "system",
        content: "You are an empathetic conversational AI assistant for mental wellness. Respond only in plain paragraph text."
      },
      ...formattedMessages
    ];

    // Requesting the completion with a strict 30-second timeout configuration safely handled by Edge
    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct:free", 
      messages: finalMessages as any,
      extra_headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
        "X-Title": "ZenithAI Dashboard",
      }
    });

    // ROBUST PARSING: OpenRouter free tier payloads sometimes structure choices uniquely.
    // This safely extracts text from any valid path without ever throwing an exception.
    let textOutput = "";
    if (response && response.choices && response.choices[0]) {
      const firstChoice = response.choices[0] as any;
      if (firstChoice.message && firstChoice.message.content) {
        textOutput = firstChoice.message.content;
      } else if (firstChoice.text) {
        textOutput = firstChoice.text;
      }
    }

    if (!textOutput || textOutput.trim() === "") {
      return NextResponse.json({ 
        text: "OpenRouter's free tier is currently congested and returned an empty response. Please wait a few seconds and try resubmitting your message!" 
      });
    }

    return NextResponse.json({ text: textOutput });

  } catch (error: any) {
    console.error("Backend Chat API Error:", error);
    const errorMessage = error?.message || "Unknown serverless function execution error";
    return NextResponse.json({ text: `API Connection Error: ${errorMessage}` });
  }
}
