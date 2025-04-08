import { AzureOpenAI } from "openai";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const azureOpenai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
  baseURL: `https://oai.helicone.ai/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    "Helicone-OpenAI-API-Base": `https://${process.env.AZURE_OPENAI_DOMAIN}.openai.azure.com`,
    "api-key": process.env.AZURE_OPENAI_API_KEY,
  },
});

if (!process.env.AZURE_OPENAI_API_KEY) throw new Error("Missing Azure OpenAI API key env var");
if (!process.env.HELICONE_API_KEY) throw new Error("Missing Helicone API key env var");
if (!process.env.AZURE_OPENAI_DEPLOYMENT_NAME) throw new Error("Missing Azure OpenAI deployment name env var");
if (!process.env.AZURE_OPENAI_DOMAIN) throw new Error("Missing Azure OpenAI domain env var");

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();

    const response = await azureOpenai.chat.completions.create({
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

    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "text/event-stream");
    headers.set("Cache-Control", "no-cache");
    headers.set("Connection", "keep-alive");

    return new Response(stream, { headers });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export const runtime = "edge";
