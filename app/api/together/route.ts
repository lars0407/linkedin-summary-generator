import OpenAI from 'openai';

const openai = new OpenAI();

if (!process.env.OPENAI_API_KEY) throw new Error("Missing OpenAI API key env var");

export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  const stream = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 200,
    stream: true,
  });

  return new Response(stream.toReadableStream());
}

export const runtime = "edge";
