export const runtime = "edge";

import { NextResponse } from "next/server";
import OpenAI from "openai";

// Configured to point straight to Groq's high-speed server
const openai = new OpenAI({
  baseURL: "https://groq.com",
  apiKey: process.env.GROQ_API_KEY || "dummy_build_key",
});

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "dummy_build_key") {
      return NextResponse.json({ 
        text: "Configuration Error: Your GROQ_API_KEY variable is missing on Vercel project settings!" 
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

    // Using Groq's highly stable Llama 3 8B model
    const response = await openai.chat.completions.create({
      model: "llama3-8b-8192", 
      messages: finalMessages as any,
    });

    const textOutput = response.choices?.[0]?.message?.content || "";

    if (!textOutput || textOutput.trim() === "") {
      return NextResponse.json({ 
        text: "The model connected, but returned an empty response string." 
      });
    }

    return NextResponse.json({ text: textOutput });

  } catch (error: any) {
    console.error("Backend Chat API Error:", error);
    const errorMessage = error?.message || "Unknown serverless function execution error";
    return NextResponse.json({ text: `API Connection Error: ${errorMessage}` });
  }
}
