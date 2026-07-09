export const runtime = "edge";

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Cleanly map the incoming array for OpenRouter consistency
    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role || "user",
      content: msg.content,
    }));

    const response = await openai.chat.completions.create({
      model: "qwen/qwen-plus",
      messages: formattedMessages,
    });

    // Safely extract content and provide a fallback string
    const textOutput = response.choices?.[0]?.message?.content || "No response text found.";

    // Return as a clean JSON structure that your frontend can easily grab
    return NextResponse.json({ text: textOutput });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown backend error";
    console.error("OpenRouter Production Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
