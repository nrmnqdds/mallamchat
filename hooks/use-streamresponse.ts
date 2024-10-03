import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import type {
	ChatCompletionMessageParam,
	ChatCompletionResponse,
} from "mallam";
import { useState } from "react";

function parsemalformedJSON(str: string): ChatCompletionResponse[] {
	try {
		// Directly attempt to parse the chunk as a valid JSON object.
		const parsed = JSON.parse(str);
		return [parsed];
	} catch (e) {
		// If parsing fails, attempt to handle concatenated JSON objects.
		try {
			// Separate concatenated JSON objects and parse them as an array.
			const modifiedChunk = `[${str.replace(/}\s*{/g, "},{")}]`;
			const parsedArray = JSON.parse(modifiedChunk);
			return parsedArray;
		} catch (error) {
			console.error("Error parsing modified JSON:", error);
			// Return an indication of an error or an empty array as appropriate.
			return [];
		}
	}
}

export const useStreamResponse = ({
	streamCallback,
	id,
}: {
	streamCallback: React.Dispatch<
		React.SetStateAction<ChatCompletionMessageParam[]>
	>;
	id?: string;
}) => {
	const [responses, setResponses] = useState<string>("");
	const [history, setHistory] = useState<ChatCompletionMessageParam[]>([]);
	const [input, setInput] = useState<string>("");
	const { toast } = useToast();

	const updateChatHistory = useMutation({
		mutationKey: ["update-history"],
		mutationFn: async ({
			latestHistory,
			id,
		}: { latestHistory: ChatCompletionMessageParam[]; id: string }) => {
			await fetch("/api/chat/update", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input: latestHistory,
					id,
				}),
			});
		},
		onSuccess: () => {
			setResponses("");
		},
	});

	const { mutateAsync: startStream, isPending: isLoading } = useMutation({
		mutationFn: async ({
			input,
			history,
		}: { input: string; history: ChatCompletionMessageParam[] }) => {
			setHistory(history);
			setInput(input);
			const response = await fetch("/api/chat/ask", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					input,
					history: history.slice(Math.max(history.length - 4, 1)),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch response");
			}

			if (!response.body) {
				throw new Error("ReadableStream not supported in this browser.");
			}

			const res = response.body.pipeThrough(new TextDecoderStream());

			if (!res) {
				throw new Error("No response body");
			}

			return res;
		},
		onSuccess: async (res) => {
			const reader = res.getReader();
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
		onSettled: async () => {
			streamCallback((prev) => [
				...prev,
				{ role: "assistant", content: responses },
			]);
			// const oldHistory = data?.history;

			const newHistory: ChatCompletionMessageParam[] = [
				JSON.parse(
					JSON.stringify({
						role: "user",
						content: input,
					}),
				),
				JSON.parse(
					JSON.stringify({
						role: "assistant",
						content: responses,
					}),
				),
			];
			const latestHistory = history?.concat(newHistory);

			if (!id || !latestHistory) {
				return;
			}

			await updateChatHistory.mutateAsync({ latestHistory, id });
		},
	});
	return { responses, startStream, isLoading };
};
