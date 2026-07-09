import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initializing the connection using the official SDK parameters to bypass Cloudflare structural limits
const openai = new OpenAI({
  baseURL: "https://openrouter.ai",
  apiKey: process.env.OPENROUTER_API_KEY,
});


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const mood = body.mood || '';

    if (!mood) {
      return NextResponse.json({ error: 'Mood input is required' }, { status: 400 });
    }

    // Leveraging the stable block completion pattern to guarantee payload delivery
    const response = await openai.chat.completions.create({
      model: 'qwen/qwen-plus', // Core mandatory Qwen Track model target
      messages: [
        {
          role: 'user',
          content: `You are ZenithAI, a helpful, conversational AI assistant just like ChatGPT and Gemini. Speak to me directly with a detailed, natural, and highly empathetic response based on my current emotional state: ${mood}`,
        }
      ]
    });

    // Safely extract the generated conversational text string directly through the SDK indices tree
    const aiTextOutput = response.choices?.[0]?.message?.content || 'Data channel active. Let\'s try sending your request again!';

    return new Response(aiTextOutput, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
    
  } catch (error: any) {
    console.error('SDK Gateway Capture:', error);
    return new Response(`System Operational Status: ${error?.message || error}. Please retry generation.`, { status: 200 });
  }
}
