import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import type {
	ChatCompletionMessageParam,
	ChatCompletionResponse,
} from "mallam";
import { useState } from "react";

function parsemalformedJSON(str: string): ChatCompletionResponse[] {
	const regex = /(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\})/g;
	const jsonObjects = str.match(regex);

	if (!jsonObjects) {
		throw new Error("No valid JSON objects found in the string");
	}

	return jsonObjects
		.map((obj) => {
			console.log(obj);
			try {
				const parsed = JSON.parse(obj) as ChatCompletionResponse;
				return parsed;
			} catch (error) {
				console.error(`Failed to parse object: ${obj}`);
				console.error(`Error: ${error}`);
				return {
					id: "err",
					message: obj,
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
	});

	const { mutateAsync: startStream, isPending: isLoading } = useMutation({
		mutationFn: async ({
			input,
			history,
		}: { input: string; history: ChatCompletionMessageParam[] }) => {
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

			if (!response.body) {
				throw new Error("ReadableStream not supported in this browser.");
			}

			const reader = response.body
				.pipeThrough(new TextDecoderStream())
				.getReader();

			return { reader, history, input };
		},
		onSuccess: async ({ reader }) => {
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
		onSettled: async (data) => {
			streamCallback((prev) => [
				...prev,
				{ role: "assistant", content: responses },
			]);
			const oldHistory = data?.history;
			const newHistory: ChatCompletionMessageParam[] = [
				{
					role: "user",
					content: data?.input as string,
				},
				{
					role: "assistant",
					content: responses,
				},
			];
			const latestHistory = oldHistory?.concat(newHistory);

			if (!id || !latestHistory) {
				return;
			}

			await updateChatHistory.mutateAsync({ latestHistory, id });
			// console.log("latestHistory: ", latestHistory);
			// await fetch("/api/chat/update", {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify({
			// 		input: latestHistory,
			// 		id,
			// 	}),
			// });
		},
	});
	return { responses, startStream, isLoading };
};
