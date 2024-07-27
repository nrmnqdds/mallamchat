import { mallam } from "@/lib/mallam";
import type { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	const { input } = await request.json();

	const result = await mallam.chatCompletion(input, {
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
