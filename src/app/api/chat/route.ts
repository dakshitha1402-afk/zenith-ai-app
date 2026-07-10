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

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array provided" }, { status: 400 });
    }

    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role || "user",
      content: msg.content,
    }));

    // HACKATHON SYSTEM FIX: Forces Qwen to only respond in paragraphs or basic HTML blocks
    const finalMessages = [
      {
        role: "system",
        content: "You are an empathetic conversational AI assistant for mental wellness. Provide short, structured responses. Respond ONLY in plain paragraph text or basic HTML structural blocks (like <p>, <br>, or <strong> tags for bullet highlights). NEVER output a complete webpage layout wrapper such as <!DOCTYPE html>, <html>, <head>, or <body> tags."
      },
      ...formattedMessages
    ];

    const response = await openai.chat.completions.create({
      model: "qwen/qwen-plus",
      messages: finalMessages,
    });

    const textOutput = response.choices?.[0]?.message?.content || "No response text found.";

    return NextResponse.json({ text: textOutput });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown backend error";
    console.error("OpenRouter Production Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
