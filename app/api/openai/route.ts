// OpenAI API implementation for edge runtime
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
      max_tokens: 500,
      stream: true,
    }),
  });

  // Create a TransformStream to process the response
  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      // Convert the chunk to text
      const text = new TextDecoder().decode(chunk);
      
      // Process each line (SSE format)
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        // Skip lines that don't start with "data: "
        if (!line.startsWith('data: ')) continue;
        
        // Remove the "data: " prefix
        const data = line.substring(6);
        
        // Skip the "[DONE]" message
        if (data === '[DONE]') continue;
        
        try {
          // Parse the JSON
          const json = JSON.parse(data);
          
          // Extract the content if it exists
          const content = json.choices?.[0]?.delta?.content;
          
          if (content) {
            // Send only the actual content text
            controller.enqueue(new TextEncoder().encode(content));
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    }
  });

  // Pipe the response through the transform stream
  return new Response(response.body?.pipeThrough(transformStream));
}

export const runtime = "edge"; 