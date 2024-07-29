"use client";

import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useInitChatStore } from "@/hooks/use-initchat";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const Page = () => {
	const { chat, createChat } = useInitChatStore();
	const [input, setInput] = useState<string>("");
	const [output, setOutput] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { toast } = useToast();

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const outputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		(async () => {
			if (chat) {
				await sendChat(chat);
			}
		})();

		return () => {
			setInput("");
			createChat("");
		};
	}, [chat, createChat]);

	useEffect(() => {
		const textarea = inputRef.current;
		if (textarea) {
			const adjustHeight = () => {
				textarea.style.height = "128px";
				textarea.style.height = `${textarea.scrollHeight}px`;
			};

			textarea.addEventListener("input", adjustHeight);

			adjustHeight();

			return () => {
				textarea.removeEventListener("input", adjustHeight);
			};
		}
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Nak resize output textarea based on output state>
	useEffect(() => {
		const textarea = outputRef.current;
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
	}, [output]);

	const sendChat = async (data: string) => {
		try {
			console.log(data);
			const response = await fetch("/api/mallam/soalan", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input: data }),
			});

			setIsLoading(false);

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
					setOutput((prev) => `${prev + message.message}`);
				}
			}
		} catch (e) {
			return toast({
				variant: "destructive",
				title: "Masalah Dalaman",
				description: "Sila cuba sebentar lagi.",
			});
		}
	};

	return (
		<div className="h-full w-full flex flex-col items-center justify-center">
			<div className="mt-5 w-full max-w-2xl flex flex-col">
				<div className="w-full">
					<Textarea
						placeholder={isLoading ? "Sedang memproses..." : "Hasil Tanya"}
						className="rounded-xl bg-zinc-900 resize-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-32"
						// readOnly
						ref={outputRef}
						value={output}
						onChange={(e) => setOutput(e.target.value)}
					/>
				</div>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						await sendChat(input);
					}}
					className="mt-10"
				>
					<div>
						<div className="relative">
							<Textarea
								className="rounded-xl bg-zinc-900 resize-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
								placeholder="Apa yang boleh MaLLaM bantu anda hari ini?"
								ref={inputRef}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={async (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										setIsLoading(true);
										await sendChat(input);
									}
								}}
							/>
							<div
								className={cn(
									"bottom-2 right-2",
									input ? "absolute" : "hidden",
								)}
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
					</div>
				</form>
			</div>
		</div>
	);
};

export default Page;
