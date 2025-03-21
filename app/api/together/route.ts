import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) throw new Error("Missing OpenAI API key");

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt || !model) {
      return new Response(
        JSON.stringify({ error: "Missing prompt or model parameter" }),
        { status: 400 }
      );
    }

    const stream = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (streamError: any) {
          console.error('Streaming error:', streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { 
        status: error.status || 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export const runtime = "edge";
