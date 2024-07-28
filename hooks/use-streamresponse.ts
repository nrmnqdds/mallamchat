import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

function useStreamResponse() {
	const [responses, setResponses] = useState("");
	const { mutate: startStream, isPending: isLoading } = useMutation({
		mutationFn: async (messageContent: string) => {
			const response = await fetch("/api/mallam/soalan", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: messageContent }),
			});

			if (!response.body) {
				throw new Error("ReadableStream not supported in this browser.");
			}

			const reader = response.body
				.pipeThrough(new TextDecoderStream())
				.getReader();

			return reader;
		},
		onSuccess: async (reader) => {
			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					break;
				}
				if (value) {
					const message = JSON.parse(value);
					console.log(message.message);
					// let message2: ChatCompletionResponse | undefined;
					// if (JSON.parse(value.split(/\s{2,}/)[1])) {
					// 	message2 = JSON.parse(value.split(/\s{2,}/)[1]);
					// }
					setResponses((prev) => `${prev + message.message}`);
				}
			}
		},
	});
	return { responses, startStream, isLoading };
}

export default useStreamResponse;
