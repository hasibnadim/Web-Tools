// app/api/stream/route.ts
import { NextRequest } from "next/server";

import { Ollama } from "ollama";
const ollama = new Ollama({ host: "https://b48921ca1be1.ngrok-free.app" });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const response = await ollama.chat({
        model: 'phi3:3.8b',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      })

      for await (const chunk of response) {
        controller.enqueue(encoder.encode(chunk.message.content))
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}