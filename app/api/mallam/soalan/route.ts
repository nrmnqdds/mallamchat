import { mallam } from "@/lib/mallam";
import type { ChatCompletionMessageParam } from "mallam";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	const { input } = await request.json();
	console.log(input);

	// const instructions: ChatCompletionMessageParam[] = [
	// 	{
	// 		role: "system",
	// 		content:
	// 			"Anda adalah MaLLaM, pembantu AI yang boleh membantu menjawab soalan pengguna. Sila jawab soalan berikut.",
	// 	},
	// 	{
	// 		role: "user",
	// 		content: input,
	// 	},
	// ];

	const result = await mallam.chatCompletion(input, {
		model: "mallam-tiny",
		stream: true,
		max_tokens: 1000,
	});

	return new Response(result, {
		headers: {
			Connection: "keep-alive",
			"Content-Encoding": "none",
			"Cache-Control": "no-cache, no-transform",
			"Content-Type": "text/event-stream; charset=utf-8",
		},
	});
}
