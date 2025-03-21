// Direct API implementation for edge runtime
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) throw new Error("Missing OpenAI API key env var");

export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  // Make a direct fetch request to OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
      stream: true,
    }),
  });

  // Return the stream response directly
  return new Response(response.body);
}

export const runtime = "edge";
