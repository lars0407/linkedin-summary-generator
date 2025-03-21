import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) throw new Error("Missing OpenAI API key env var");

export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 200,
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          controller.enqueue(new TextEncoder().encode(content));
        }
      }
      controller.close();
    },
  });

  return new Response(stream);
}

export const runtime = "edge";
