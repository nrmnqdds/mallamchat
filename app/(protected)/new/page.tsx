"use client";

import TextShimmer from "@/components/ui/text-shimmer";
import { Textarea } from "@/components/ui/textarea";
import { useInitChatStore } from "@/hooks/use-initchat";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
	input: z.string().min(1, { message: "Sila masukkan soalan anda" }),
});

const today = new Date();
const curHr = today.getHours();

const Page = () => {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			input: "",
		},
	});

	const { createChat } = useInitChatStore();
	const session = useSession();
	const router = useRouter();

	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
		}
	}, [inputRef]);

	const onSubmit = useCallback(async (data: z.infer<typeof schema>) => {
		createChat(data.input);

		const res = await fetch("/api/chat/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			console.log(res);
			return toast.error("MaLLaM tidak dapat menjawab soalan anda");
		}

		const json = await res.json();
		console.log(json);

		router.push(`/chat/${json.id}`);
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				onSubmit(form.getValues());
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
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
			</div>
		</div>
	);
};

export default Page;
