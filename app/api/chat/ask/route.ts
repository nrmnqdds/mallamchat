import { mallam } from "@/lib/mallam";
import type { ChatCompletionMessageParam } from "mallam";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	const { input, history } = await request.json();

	const fullPrompt = history.concat({ role: "user", content: input });
	console.log(fullPrompt);

	const instruction: ChatCompletionMessageParam[] = [
		{
			role: "system",
			content:
				"Anda adalah MaLLaM, pembantu kecerdasan buatan yang boleh membantu menjawab soalan user. Sila jawab soalan berikut atau sambung perbualan dalam bahasa Melayu berdasarkan context dari perbualan yang diberikan. Jangan tanya apa apa yang tiada kena mengena dengan konteks melainkan user sendiri yang tanya",
		},
		...fullPrompt,
	];

	const result = await mallam.chatCompletion(instruction, {
		// model: "mallam-tiny",
		stream: true,
		max_tokens: 500,
	});

	return new NextResponse(result, {
		// Set the headers for Server-Sent Events (SSE)
		headers: {
			Connection: "keep-alive",
			"Transfer-Encoding": "chunked",
			"Content-Encoding": "none",
			"Cache-Control": "no-cache, no-transform",
			"Content-Type": "text/event-stream; charset=utf-8",
		},
	});
}
