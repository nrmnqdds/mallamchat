import { mallam } from "@/lib/mallam";
import type { ChatCompletionMessageParam } from "mallam";
import { type NextRequest, NextResponse } from "next/server";

// export const runtime = "edge";
// export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	const { input } = await request.json();
	console.log(input);

	const instruction: ChatCompletionMessageParam[] = [
		{
			role: "system",
			content:
				"Anda adalah MaLLaM, pembantu AI yang boleh membantu menjawab soalan pengguna. Sila jawab soalan berikut.",
		},
		{
			role: "user",
			content: input,
		},
	];

	const result = await mallam.chatCompletion(instruction, {
		model: "mallam-tiny",
		stream: true,
		max_tokens: 1000,
	});

	return new Response(result, {
		// Set the headers for Server-Sent Events (SSE)
		headers: {
			Connection: "keep-alive",
			"Transfer-Encoding": "chunked",
			"Content-Encoding": "none",
			"Cache-Control": "no-cache, no-transform",
			"Content-Type": "json/event-stream; charset=utf-8",
		},
	});

	// const encoder = new TextEncoder();
	//
	// // Create a streaming response
	// const customReadable = new ReadableStream({
	// 	async start(controller) {
	// 		const res = await mallam.chatCompletion(instruction, {
	// 			stream: true,
	// 		});
	//
	// 		const reader = res.getReader();
	// 		let result;
	// 		while ((result = await reader.read()) && !result.done) {
	// 			controller.enqueue(
	// 				encoder.encode(`${JSON.stringify(result.value)}\n\n`),
	// 			);
	// 		}
	//
	// 		controller.close();
	// 	},
	// });
	//
	// return new Response(customReadable, {
	// 	// Set the headers for Server-Sent Events (SSE)
	// 	headers: {
	// 		Connection: "keep-alive",
	// 		"Transfer-Encoding": "chunked",
	// 		"Content-Encoding": "none",
	// 		"Cache-Control": "no-cache, no-transform",
	// 		"Content-Type": "json/event-stream; charset=utf-8",
	// 	},
	// });
}
