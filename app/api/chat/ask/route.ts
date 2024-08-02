import { mallam } from "@/lib/mallam";
import type { ChatCompletionMessageParam } from "mallam";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { input, history } = await request.json();

  console.log("input: ", input);
  console.log("history: ", history);

  const instruction: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `Anda adalah MaLLaM, pembantu kecerdasan buatan yang boleh membantu menjawab soalan user. Sila jawab soalan berikut atau sambung perbualan dalam bahasa Melayu berdasarkan context dari perbualan yang diberikan: ${JSON.stringify(history)}`,
    },
    {
      role: "user",
      content: input,
    },
  ];

  const result = await mallam.chatCompletion(instruction, {
    // model: "mallam-tiny",
    stream: true,
    max_tokens: 1000,
  });

  return new NextResponse(result, {
    // Set the headers for Server-Sent Events (SSE)
    headers: {
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "json/event-stream; charset=utf-8",
    },
  });
}
