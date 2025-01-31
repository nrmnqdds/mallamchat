"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TextShimmer from "@/components/ui/text-shimmer";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useInitChatStore } from "@/hooks/use-initchat";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	input: z.string().min(1, { message: "Sila masukkan soalan anda" }),
});

const today = new Date();
const curHr = today.getHours();

const contohPrompt = [
	{
		key: 0,
		value: "Apa maksud KWSP?",
	},
	{
		key: 1,
		value: "Berapa harga iPhone 13?",
	},
	{
		key: 2,
		value: "Cara membuat kuih lapis?",
	},
];

const cardAnimation = {
	hidden: { height: 0 },
	visible: {
		height: "auto",
		transition: { ease: "easeOut" },
	},
};

const cardAnimation2 = {
	hidden: { scale: 0, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: { delay: 0.3, ease: "easeOut" },
	},
};

const MotionCard = motion(Card);

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
	const { toast } = useToast();

	const inputRef = useRef<HTMLTextAreaElement>(null);

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

	const { mutateAsync, isPending } = useMutation({
		mutationKey: ["new-chat"],
		mutationFn: async (data: z.infer<typeof schema>) => {
			const res = await fetch("/api/chat/new", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				console.log(res);
				return toast({
					variant: "destructive",
					title: "Masalah Dalaman",
					description: "MaLLaM tidak dapat menjawab soalan anda",
				});
			}

			const json = await res.json();

			return json;
		},
		onSuccess: (data) => {
			router.push(`/chat/${data.id}`);
		},
	});

	const onSubmit = useCallback(
		async (data: z.infer<typeof schema>) => {
			if (!session.data?.user) {
				signIn("google");
			}
			createChat(data.input);
			await mutateAsync(data);
		},
		[session.data?.user, createChat, mutateAsync],
	);

	return (
		<div className="w-full flex flex-col items-center justify-center">
			<div className="backdrop-filter-[12px] animate-fade-in group inline-flex h-7 -translate-y-4 items-center justify-between gap-1 rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white opacity-0 transition-all ease-in hover:cursor-pointer hover:bg-white/20 dark:text-black">
				<TextShimmer className="inline-flex items-center justify-center">
					<span>
						Using free plan<span className="text-purple-400"> Upgrade</span>
					</span>
				</TextShimmer>
			</div>
			<div className="mt-5 w-3/4 sm:w-full max-w-2xl flex flex-col">
				<motion.h1
					initial={{ opacity: 0, y: 10 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { delay: 0.1, ease: "easeOut" },
					}}
					className="text-2xl sm:text-5xl text-center"
				>
					🌙{" "}
					{curHr < 12
						? "Selamat Pagi, "
						: curHr < 18
							? "Selamat Tengahari, "
							: "Selamat MaLLaM, "}
					{session.data?.user?.name ?? "visitor"}
				</motion.h1>
				<form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 z-10">
					<div>
						<div className="relative">
							<Textarea
								className="rounded-xl bg-zinc-800 resize-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
								placeholder="Apa yang boleh MaLLaM bantu anda hari ini?"
								ref={inputRef}
								value={form.watch("input")}
								disabled={isPending}
								onChange={(e) => {
									form.setValue("input", e.target.value);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										form.handleSubmit(onSubmit)();
									}
								}}
							/>
							<div className="absolute bottom-2 left-2 pointer-events-none">
								<p className="text-zinc-700 text-xs">mallam-small</p>
							</div>
							<div
								className={cn(
									"top-2 right-2",
									form.getValues("input") ? "absolute" : "hidden",
								)}
							>
								<Button
									type="submit"
									className="size-8 self-end flex items-center justify-center relative"
								>
									<Send className="absolute" size={15} />
								</Button>
							</div>
							<div
								className={cn(
									"bottom-2 right-2 flex flex-col",
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
				<motion.div
					variants={cardAnimation}
					initial="hidden"
					animate="visible"
					className="relative rounded-b-xl bg-zinc-900 border-card w-[98%] self-center z-[9] h-fit -translate-y-3"
				>
					<div className="p-5 flex flex-col">
						<motion.h1
							initial={{ opacity: 0, y: 10 }}
							animate={{
								opacity: 1,
								y: 0,
								transition: { delay: 0.2, ease: "easeOut" },
							}}
						>
							Contoh prompt yang boleh digunakan:
						</motion.h1>
						<div className="flex flex-row items-center justify-between space-x-2 mt-5">
							{contohPrompt.map((prompt) => (
								<MotionCard
									key={prompt.key}
									variants={cardAnimation2}
									initial="hidden"
									animate="visible"
									whileHover={{ scale: 1.05 }}
									className="p-2 bg-zinc-800 cursor-pointer rounded-xl text-center h-full"
									onClick={() => {
										form.setValue("input", prompt.value);
										form.handleSubmit(() =>
											onSubmit({ input: prompt.value }),
										)();
									}}
								>
									<h1 className="text-xs md:text-base">{prompt.value}</h1>
								</MotionCard>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default Page;
