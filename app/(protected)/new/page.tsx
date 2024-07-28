"use client";

import TextShimmer from "@/components/ui/text-shimmer";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	input: z.string().min(1, { message: "Sila masukkan soalan anda" }),
});

const today = new Date();
const curHr = today.getHours();

const Page = () => {
	const session = useSession();
	const [output, setOutput] = useState<string>("");
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			input: "",
		},
	});

	const outputRef = useRef<HTMLTextAreaElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.style.height = `${outputRef.current.scrollHeight}px`;
		}
	}, [output]);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
		}
	}, [output]);

	const onSubmit = useCallback(async (data: z.infer<typeof schema>) => {
		setOutput("");
		const res = await fetch("/api/mallam/soalan", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.body) return;

		const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();

		while (true) {
			const { value, done } = await reader.read();
			if (done) {
				break;
			}
			if (value) {
				const message = JSON.parse(value.split(/\s{2,}/)[0]);
				console.log(message.message);
				// let message2: ChatCompletionResponse | undefined;
				// if (JSON.parse(value.split(/\s{2,}/)[1])) {
				// 	message2 = JSON.parse(value.split(/\s{2,}/)[1]);
				// }
				setOutput((prev) => `${prev + message.message}`);
			}
		}
	}, []);

	return (
		<div className="w-full flex flex-col items-center justify-center">
			<div className="backdrop-filter-[12px] animate-fade-in group inline-flex h-7 -translate-y-4 items-center justify-between gap-1 rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white opacity-0 transition-all ease-in hover:cursor-pointer hover:bg-white/20 dark:text-black">
				<TextShimmer className="inline-flex items-center justify-center">
					<span>
						Using free plan<span className="text-purple-400"> Upgrade</span>
					</span>
				</TextShimmer>
			</div>
			<div className="mt-5 w-full max-w-2xl flex flex-col">
				<h1 className="text-5xl text-center">
					🌙{" "}
					{curHr < 12
						? "Selamat Pagi, "
						: curHr < 18
							? "Selamat Petang, "
							: "Selamat MaLLaM, "}
					{session.data?.user?.name ?? "visitor"}
				</h1>
				<form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
					<div>
						<div className="relative">
							<Textarea
								className="rounded-xl bg-zinc-900 resize-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-32"
								placeholder="Apa yang boleh MaLLaM bantu anda hari ini?"
								ref={inputRef}
								value={form.watch("input")}
								onChange={(e) => {
									form.setValue("input", e.target.value);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										form.handleSubmit(onSubmit)();
									}
								}}
							/>
							<div
								className={cn(
									"bottom-2 right-2",
									form.getValues("input") ? "absolute" : "hidden",
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
						{form.formState.errors.input && (
							<p className="text-sm text-red-600">
								{form.formState.errors.input.message}
							</p>
						)}
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
