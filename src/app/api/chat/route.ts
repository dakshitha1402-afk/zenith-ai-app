export const runtime = "edge"; // <-- Add this exact line here!

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "qwen/qwen-plus",
      messages: messages,
    });

    return NextResponse.json(response.choices[0].message); // <-- Note: added [0] here to parse OpenAI format cleanly!
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("OpenRouter API Error:", errorMessage);
    return NextResponse.json({ error: "Failed to fetch response from Qwen model" }, { status: 500 });
  }
}
