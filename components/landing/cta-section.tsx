"use client";

import { buttonVariants } from "@/components/ui/button";
import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { motion, useAnimation, useInView } from "motion/react";
import {
	BarChart,
	ChevronRight,
	File,
	Globe,
	HeartHandshake,
	Rss,
	Shield,
} from "lucide-react";
import Link from "next/link";
import { type JSX, useEffect, useId, useRef, useState } from "react";

const tiles = [
	{
		icon: <HeartHandshake className="size-full" />,
		bg: (
			<div className="pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-orange-600 via-rose-600 to-violet-600 opacity-70 blur-[20px]" />
		),
	},
	{
		icon: <Globe className="size-full" />,
		bg: (
			<div className="pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-70 blur-[20px]" />
		),
	},
	{
		icon: <File className="size-full" />,
		bg: (
			<div className="pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 opacity-70 blur-[20px]" />
		),
	},
	{
		icon: <Shield className="size-full" />,
		bg: (
			<div className="pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 opacity-70 blur-[20px]" />
		),
	},
	{
		icon: <Rss className="size-full" />,
		bg: (
			<div className="pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-orange-600 via-rose-600 to-violet-600 opacity-70 blur-[20px]" />
		),
	},
	{
		icon: <BarChart className="size-full" />,
		bg: (
			<div className="pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 opacity-70 blur-[20px]" />
		),
	},
];

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function shuffleArray(array: any[]) {
	let currentIndex = array.length;
	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
	let randomIndex;
	// While there remain elements to shuffle.
	while (currentIndex !== 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
	return array;
}

function Card(card: { icon: JSX.Element; bg: JSX.Element }) {
	const id = useId();
	const controls = useAnimation();
	const ref = useRef(Element.prototype);
	const inView = useInView(ref, { once: true });

	useEffect(() => {
		if (inView) {
			controls.start({
				opacity: 1,
				transition: { delay: Math.random() * 2, ease: "easeOut", duration: 1 },
			});
		}
	}, [controls, inView]);

	return (
		<motion.div
			key={id}
			// @ts-ignore
			ref={ref}
			initial={{ opacity: 0 }}
			animate={controls}
			className={cn(
				"relative size-20 cursor-pointer overflow-hidden rounded-2xl border p-4",
				// light styles
				"bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
				// dark styles
				"transform-gpu dark:bg-transparent dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
			)}
		>
			{card.icon}
			{card.bg}
		</motion.div>
	);
}

export default function CallToActionSection() {
	const [randomTiles1, setRandomTiles1] = useState<typeof tiles>([]);
	const [randomTiles2, setRandomTiles2] = useState<typeof tiles>([]);
	const [randomTiles3, setRandomTiles3] = useState<typeof tiles>([]);
	const [randomTiles4, setRandomTiles4] = useState<typeof tiles>([]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			// Ensures this runs client-side
			setRandomTiles1(shuffleArray([...tiles]));
			setRandomTiles2(shuffleArray([...tiles]));
			setRandomTiles3(shuffleArray([...tiles]));
			setRandomTiles4(shuffleArray([...tiles]));
		}
	}, []);

	return (
		<section id="cta">
			<div className="py-14">
				<div className="flex w-full flex-col items-center justify-center">
					<div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
						<Marquee
							reverse
							className="-delay-[200ms] [--duration:10s]"
							repeat={5}
						>
							{randomTiles1.map((review, idx) => (
								<Card key={idx} {...review} />
							))}
						</Marquee>
						<Marquee reverse className="[--duration:25s]" repeat={5}>
							{randomTiles2.map((review, idx) => (
								<Card key={idx} {...review} />
							))}
						</Marquee>
						<Marquee
							reverse
							className="-delay-[200ms] [--duration:20s]"
							repeat={5}
						>
							{randomTiles1.map((review, idx) => (
								<Card key={idx} {...review} />
							))}
						</Marquee>
						<Marquee reverse className="[--duration:30s]" repeat={5}>
							{randomTiles2.map((review, idx) => (
								<Card key={idx} {...review} />
							))}
						</Marquee>
						<Marquee
							reverse
							className="-delay-[200ms] [--duration:20s]"
							repeat={5}
						>
							{randomTiles3.map((review, idx) => (
								<Card key={idx} {...review} />
							))}
						</Marquee>
						<Marquee reverse className="[--duration:30s]" repeat={5}>
							{randomTiles4.map((review, idx) => (
								<Card key={idx} {...review} />
							))}
						</Marquee>
						<div className="absolute z-10">
							<div className="mx-auto size-24 rounded-[2rem] border bg-white/10 p-3 shadow-2xl backdrop-blur-md lg:size-32 dark:bg-black/10">
								<HeartHandshake className="mx-auto size-16 text-black lg:size-24 dark:text-white" />
							</div>
							<div className="text-primary z-10 mt-4 flex flex-col items-center text-center">
								<h1 className="text-3xl font-bold lg:text-4xl">
									Stop wasting time on design.
								</h1>
								<p className="mt-2">
									Start your 7-day free trial. No credit card required.
								</p>
								<Link
									href="#"
									className={cn(
										buttonVariants({
											size: "lg",
											variant: "outline",
										}),
										"group mt-4 rounded-[2rem] px-6",
									)}
								>
									Get Started
									<ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
								</Link>
							</div>
							<div className="bg-backtround dark:bg-background absolute inset-0  -z-10 rounded-full opacity-40 blur-xl" />
						</div>
						<div className="to-backtround dark:to-background absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-70%" />
					</div>
				</div>
			</div>
		</section>
	);
}
