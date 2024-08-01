import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import type {
	ChatCompletionMessageParam,
	ChatCompletionResponse,
} from "mallam";
import { useState } from "react";

// Current workaround for parsing malformed JSON
function parsemalformedJSON(str: string): ChatCompletionResponse[] {
	// Split the string into separate JSON objects
	// I write this myself trust me
	const regex = /(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\})/g;
	const jsonObjects = str.match(regex);

	if (!jsonObjects) {
		throw new Error("No valid JSON objects found in the string");
	}

	// Parse each object and return the array
	return jsonObjects.map((obj) => {
		const parsed = JSON.parse(obj) as ChatCompletionResponse;
		if (typeof parsed.id !== "string" || typeof parsed.message !== "string") {
			throw new Error(
				"Parsed object does not match ChatCompletionResponse interface",
			);
		}
		return parsed;
	});
}

export const useStreamResponse = ({
	streamCallback,
}: {
	streamCallback: React.Dispatch<
		React.SetStateAction<ChatCompletionMessageParam[]>
	>;
}) => {
	const [responses, setResponses] = useState<string>("");
	const { toast } = useToast();

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

			return reader;
		},
		onSuccess: async (reader) => {
			setResponses("");
			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					break;
				}
				if (value) {
					const text: ChatCompletionResponse[] = parsemalformedJSON(value);

					for (const message of text) {
						setResponses((prev) => prev + message.message);
					}
				}
			}
		},
		onError: (error) => {
			console.error(error);
			toast({
				title: "Masalah Dalaman",
				description:
					"Terdapat masalah semasa memuatkan soalan. Sila cuba lagi.",
			});
		},
		onSettled: () => {
			streamCallback((prev) => [
				...prev,
				{ role: "assistant", content: responses },
			]);
		},
	});
	return { responses, startStream, isLoading };
};
