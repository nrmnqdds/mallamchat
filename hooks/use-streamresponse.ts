import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import type {
	ChatCompletionMessageParam,
	ChatCompletionResponse,
} from "mallam";
import { useState } from "react";

function parsemalformedJSON(str: string): ChatCompletionResponse[] {
	console.log("string before regex: ", str);
	// const regex = /(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\})/g;
	const regex = /\{[^}]+\}/g;
	const jsonObjects = str.match(regex);

	if (!jsonObjects) {
		throw new Error("No valid JSON objects found in the string");
	}

	return jsonObjects
		.map((obj, i) => {
			console.log("string after regex: ", obj);
			try {
				const parsed = JSON.parse(obj) as ChatCompletionResponse;
				return parsed;
			} catch (error) {
				console.error(`Failed to parse object: ${obj}`);
				console.error(`Error: ${error}`);
				return {
					id: `err-${i}`,
					message: " \n",
				};
			}
		})
		.filter((obj): obj is ChatCompletionResponse => obj !== null);
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
