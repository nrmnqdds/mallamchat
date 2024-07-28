"use client";

import { Textarea } from "@/components/ui/textarea";
import { useInitChatStore } from "@/hooks/use-initchat";
import useStreamResponse from "@/hooks/use-streamresponse";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const Page = () => {
	const { chat, createChat } = useInitChatStore();
	const [input, setInput] = useState<string>("");
	const { startStream, isLoading, responses } = useStreamResponse();

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const outputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (chat) {
			startStream(chat);
		}

		return () => {
			setInput("");
			createChat("");
		};
	}, [chat]);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
		}
	}, [inputRef]);

	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.style.height = `${outputRef.current.scrollHeight}px`;
		}
	}, [outputRef]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey && e.key === "Enter" && !e.shiftKey) {
				startStream(input);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="w-full flex flex-col items-center justify-center">
			<div className="w-full">
				<Textarea
					placeholder={isLoading ? "Sedang memproses..." : "Hasil Tanya"}
					className="bg-zinc-900 resize-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-32"
					readOnly
					ref={outputRef}
					value={responses}
				/>
			</div>
			<div className="mt-5 w-full max-w-2xl flex flex-col">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						startStream(input);
					}}
					className="mt-10"
				>
					<div>
						<div className="relative">
							<Textarea
								className="rounded-xl bg-zinc-900 resize-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-32"
								placeholder="Apa yang boleh MaLLaM bantu anda hari ini?"
								ref={inputRef}
								value={input}
								onChange={(e) => setInput(e.target.value)}
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
				{/* <div className="w-full"> */}
				{/* 	<Textarea */}
				{/* 		placeholder={ */}
				{/* 			form.formState.isSubmitting */}
				{/* 				? "Sedang memproses..." */}
				{/* 				: "Hasil Tanya" */}
				{/* 		} */}
				{/* 		className="bg-zinc-900 resize-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-32" */}
				{/* 		readOnly */}
				{/* 		ref={outputRef} */}
				{/* 		value={output} */}
				{/* 	/> */}
				{/* </div> */}
			</div>
		</div>
	);
};

export default Page;
