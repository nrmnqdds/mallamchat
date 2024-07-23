import { mallam } from "@/lib/mallam";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
	const { input } = await request.json();

	console.log("FrasaSemula: ", input);
	const instruction = [
		{
			role: "system",
			content:
				"Anda adalah sebuah pembantu yang hebat dalam menukarkan ayat yang diberikan kepada ayat lain yang membawa maksud yang sinonim. Tukar ayat berdasarkan input yang diberikan kepada ayat lain yang membawa maksud dan konteks yang seerti dengannya. Jangan berikan jawapan yang sama dengan input yang diberikan. Contoh: Input: 'Dia suka makan nasi.' Jawapan: 'Dia gemar memakan nasi.'. Terus sahaja memberi respons dalam bentuk ayat yang baharu tanpa menggunakan pembuka bicara seperti 'Jawapannya', 'Sudah tentu' dan lain lain. Juga tidak perlu menggunakan tanda baca petikan ganda atau 'double-quote'. Jika anda tidak dapat memberi respons, jawab 'Saya tidak tahu' atau 'Saya tidak pasti'. Sekiranya input merupakan bukan dari bahasa Melayu, sila berikan respons supaya ia menjadi ayat yang bermaksud dalam bahasa Melayu.",
		},
		{
			role: "user",
			content: input,
		},
	];

	const encoder = new TextEncoder();

	// Create a streaming response
	const customReadable = new ReadableStream({
		async start(controller) {
			const res = await mallam.chatCompletion(instruction, {
				stream: true,
			});

			const reader = res.getReader();
			let result;
			while ((result = await reader.read()) && !result.done) {
				controller.enqueue(
					encoder.encode(`${JSON.stringify(result.value)}\n\n`),
				);
			}

			controller.close();
		},
	});

	return new Response(customReadable, {
		// Set the headers for Server-Sent Events (SSE)
		headers: {
			Connection: "keep-alive",
			"Content-Encoding": "none",
			"Cache-Control": "no-cache, no-transform",
			"Content-Type": "json/event-stream; charset=utf-8",
		},
	});
}
