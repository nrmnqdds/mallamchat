"use server";

import { mallam } from "@/lib/mallam";
import type { CoreMessage } from "ai";
import { createStreamableValue } from "ai/rsc";
import type { ChatCompletionResponse } from "mallam";

export async function FrasaSemula(input: string) {
	const instruction = [
		{
			role: "system",
			content:
				"Anda adalah sebuah pembantu yang hebat dalam menukarkan ayat kepada ayat lain yang sinonim. Tukar ayat berdasarkan input yang diberikan kepada ayat lain yang membawa maksud yang seerti dengannya. Jangan berikan jawapan yang sama dengan input yang diberikan. Contoh: Input: 'Dia suka makan nasi.' Jawapan: 'Dia gemar memakan nasi.'. Terus sahaja memberi respons dalam bentuk ayat yang baharu tanpa menggunakan pembuka bicara seperti 'Jawapannya', 'Sudah tentu' dan lain lain. Juga tidak perlu menggunakan tanda baca petikan ganda atau 'double-quote'. Jika anda tidak dapat memberi respons, jawab 'Saya tidak tahu' atau 'Saya tidak pasti'.",
		},
		{
			role: "user",
			content: input,
		},
	];
	const result = await mallam.chatCompletion(instruction, {
		stream: true,
	});

	const stream = createStreamableValue<
		ReadableStream<ChatCompletionResponse> | CoreMessage
	>(result);

	return stream.value;
}
