import { mallam } from "@/lib/mallam";
import type { ChatCompletionMessageParam } from "mallam";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	const { input, prev } = await request.json();

	const instruction: ChatCompletionMessageParam[] = [
		{
			role: "system",
			content: `Anda adalah MaLLaM, pembantu AI yang boleh membantu menjawab soalan pengguna. Sila jawab soalan berikut berdasarkan context yang diberikan: ${prev}`,
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
