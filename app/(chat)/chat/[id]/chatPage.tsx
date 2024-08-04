"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInitChatStore } from "@/hooks/use-initchat";
import { useStreamResponse } from "@/hooks/use-streamresponse";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Moon, User } from "lucide-react";
import type { ChatCompletionMessageParam } from "mallam";
import { useEffect, useRef, useState } from "react";

const ChatPage = ({ id }: { id: string }) => {
	const { chat, createChat } = useInitChatStore();
	const [input, setInput] = useState<string>("");
	const [output, setOutput] = useState<ChatCompletionMessageParam[]>([
		{
			role: "user",
			content: chat,
		},
	]);

	const { responses, startStream, isLoading } = useStreamResponse({
		streamCallback: setOutput,
		id,
	});

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const responseRef = useRef<HTMLTextAreaElement>(null);

	useQuery({
		queryKey: ["init-chat"],
		queryFn: async () => {
			const res = await fetch(`/api/chat/${id}`);
			const json = await res.json();
			if (json.contents.length > 1) {
				setOutput(json.contents);
				createChat("");
			} else {
				startStream({
					input: chat,
					history: json.contents.length > 1 ? json : [],
				});
			}
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	// Resize input textarea based on input state
	useEffect(() => {
		const textarea = inputRef.current;
		if (textarea) {
			const adjustHeight = () => {
				textarea.style.height = "auto";
				textarea.style.height = `${textarea.scrollHeight}px`;
			};

			textarea.addEventListener("input", adjustHeight);

			adjustHeight();

			return () => {
				textarea.removeEventListener("input", adjustHeight);
			};
		}
	}, []);

	// Resize output textarea based on output state
	// biome-ignore lint/correctness/useExhaustiveDependencies: <Nak resize output textarea based on output state>
	useEffect(() => {
		const textarea = responseRef.current;
		if (textarea) {
			const adjustHeight = () => {
				textarea.style.height = "auto";
				textarea.style.height = `${textarea.scrollHeight}px`;
			};

			textarea.addEventListener("input", adjustHeight);

			adjustHeight();

			return () => {
				textarea.removeEventListener("input", adjustHeight);
			};
		}
	}, [responses]);

	return (
		<div className="h-full w-full flex flex-col items-center justify-center">
			<div className="h-full mt-5 gap-5 w-full max-w-2xl flex flex-col">
				{output
					.filter((msg) => msg.content !== responses)
					.map((message, index) => (
						<div
							key={index}
							className={cn(
								"w-[90%] flex gap-2",
								message.role === "user"
									? "flex-row-reverse self-end"
									: "flex-row self-start",
							)}
						>
							<Label>
								{message.role === "user" ? <User /> : <Moon color="yellow" />}
							</Label>
							<div className="rounded-xl bg-zinc-900 p-2 border border-input ring-offset-background">
								{message.content}
							</div>
						</div>
					))}
				<div className="w-[90%] flex flex-row gap-2">
					<Label>
						<Moon color="yellow" />
					</Label>
					<Textarea
						placeholder={isLoading ? "Sedang memproses..." : "Hasil Tanya"}
						className="rounded-xl bg-zinc-900 resize-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
						readOnly
						ref={responseRef}
						value={responses}
					/>
				</div>
				<form className="mt-10">
					<div className="relative">
						<Textarea
							className="rounded-xl bg-zinc-900 resize-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
							placeholder="Apa yang boleh MaLLaM bantu anda hari ini?"
							ref={inputRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={async (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									setInput("");
									setOutput((prev) => [
										...prev,
										{ role: "user", content: input },
									]);
									await startStream({ input, history: output });
								}
							}}
						/>
						<div
							className={cn("bottom-2 right-2", input ? "absolute" : "hidden")}
						>
							<p className="text-foreground text-xs">
								Use{" "}
								<span className="bg-zinc-700 px-1 rounded-full">
									shift + return
								</span>{" "}
								for new line
							</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ChatPage;
