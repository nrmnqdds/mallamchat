import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const useStreamResponse = () => {
	const [responses, setResponses] = useState<string>("");

	const { mutateAsync: startStream, isPending: isLoading } = useMutation({
		mutationFn: async (messageContent: string) => {
			const response = await fetch("/api/mallam/soalan", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: messageContent }),
			});

			if (!response.body) {
				throw new Error("ReadableStream not supported in this browser.");
			}

			const reader = response.body
				.pipeThrough(new TextDecoderStream())
				.getReader();

			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					break;
				}
				if (value) {
					console.log(value);
					const message = JSON.parse(value);
					setResponses((prev) => `${prev + message.message}`);
				}
			}

			return reader;
		},
		// onSuccess: async (reader) => {
		// 	while (true) {
		// 		const { value, done } = await reader.read();
		// 		if (done) {
		// 			break;
		// 		}
		// 		if (value) {
		// 			console.log(value);
		// 			const message = JSON.parse(value);
		// 			setResponses((prev) => `${prev + message.message}`);
		// 		}
		// 	}
		// },
	});
	return { responses, startStream, isLoading };
};
