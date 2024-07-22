"use client";

import LOGO from "@/assets/images/tatabahasaly-logo.png";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	TransitionChild,
} from "@headlessui/react";
import {
	Bars3Icon,
	DocumentTextIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
	{
		name: "Periksa Tatabahasa",
		href: "/periksa-tatabahasa",
		icon: DocumentTextIcon,
	},
	{
		name: "Frasa Semula",
		href: "/frasa-semula",
		icon: DocumentTextIcon,
	},
	{
		name: "Format Teks",
		href: "/format-teks",
		icon: DocumentTextIcon,
	},
	{
		name: "Terjemah Teks",
		href: "/terjemah-teks",
		icon: DocumentTextIcon,
	},
];
// const teams = [
// 	{ id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
// 	{ id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
// 	{ id: 3, name: "Workcation", href: "#", initial: "W", current: false },
// ];

export default function Layout({ children }: { children: React.ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();
	const { data: session } = useSession();

	const login = async () => {
		await signIn("google");
	};

	return session ? (
		<>
			<div>
				<Dialog
					open={sidebarOpen}
					onClose={setSidebarOpen}
					className="relative z-50 lg:hidden"
				>
					<DialogBackdrop
						transition
						className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
					/>

					<div className="fixed inset-0 flex">
						<DialogPanel
							transition
							className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
						>
							<TransitionChild>
								<div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
									<button
										type="button"
										onClick={() => setSidebarOpen(false)}
										className="-m-2.5 p-2.5"
									>
										<span className="sr-only">Close sidebar</span>
										<XMarkIcon
											aria-hidden="true"
											className="h-6 w-6 text-white"
										/>
									</button>
								</div>
							</TransitionChild>
							{/* Sidebar component, swap this element with another sidebar if you like */}
							<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-2">
								<div className="flex h-16 shrink-0 items-center">
									<Image
										alt="Tatabahasaly logo"
										src={LOGO}
										className="object-contain"
										height={32}
										width={32}
									/>
								</div>
								<nav className="flex flex-1 flex-col">
									<ul className="flex flex-1 flex-col gap-y-7">
										<li>
											<ul className="-mx-2 space-y-1">
												{navigation.map((item) => (
													<li key={item.name}>
														<Link
															href={item.href}
															className={cn(
																pathname === item.href
																	? "bg-indigo-700 text-white"
																	: "text-indigo-200 hover:bg-indigo-700 hover:text-white",
																"group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
															)}
														>
															<item.icon
																aria-hidden="true"
																className={cn(
																	pathname === item.href
																		? "text-white"
																		: "text-indigo-200 group-hover:text-white",
																	"h-6 w-6 shrink-0",
																)}
															/>
															{item.name}
														</Link>
													</li>
												))}
											</ul>
										</li>
									</ul>
								</nav>
							</div>
						</DialogPanel>
					</div>
				</Dialog>

				{/* Static sidebar for desktop */}
				<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6">
						<div className="flex h-16 shrink-0 items-center">
							<Image
								alt="Tatabahasaly logo"
								src={LOGO}
								className="object-contain"
								height={32}
								width={32}
							/>
							{/* <img */}
							{/* 	alt="Your Company" */}
							{/* 	src="https://tailwindui.com/img/logos/mark.svg?color=white" */}
							{/* 	className="h-8 w-auto" */}
							{/* /> */}
						</div>
						<nav className="flex flex-1 flex-col">
							<ul className="flex flex-1 flex-col gap-y-7">
								<li>
									<ul className="-mx-2 space-y-1">
										{navigation.map((item) => (
											<li key={item.name}>
												<Link
													href={item.href}
													className={cn(
														pathname === item.href
															? "bg-indigo-700 text-white"
															: "text-indigo-200 hover:bg-indigo-700 hover:text-white",
														"group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
													)}
												>
													<item.icon
														aria-hidden="true"
														className={cn(
															pathname === item.href
																? "text-white"
																: "text-indigo-200 group-hover:text-white",
															"h-6 w-6 shrink-0",
														)}
													/>
													{item.name}
												</Link>
											</li>
										))}
									</ul>
								</li>
								{/* <li> */}
								{/* 	<div className="text-xs font-semibold leading-6 text-indigo-200"> */}
								{/* 		Your teams */}
								{/* 	</div> */}
								{/* 	<ul className="-mx-2 mt-2 space-y-1"> */}
								{/* 		{teams.map((team) => ( */}
								{/* 			<li key={team.name}> */}
								{/* 				<a */}
								{/* 					href={team.href} */}
								{/* 					className={cn( */}
								{/* 						team.current */}
								{/* 							? "bg-indigo-700 text-white" */}
								{/* 							: "text-indigo-200 hover:bg-indigo-700 hover:text-white", */}
								{/* 						"group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6", */}
								{/* 					)} */}
								{/* 				> */}
								{/* 					<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white"> */}
								{/* 						{team.initial} */}
								{/* 					</span> */}
								{/* 					<span className="truncate">{team.name}</span> */}
								{/* 				</a> */}
								{/* 			</li> */}
								{/* 		))} */}
								{/* 	</ul> */}
								{/* </li> */}
								<li className="-mx-6 mt-auto">
									<a
										href="#"
										className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-indigo-700"
									>
										<Image
											alt=""
											//@ts-ignore
											src={session?.user?.image}
											className="rounded-full bg-indigo-700"
											width={32}
											height={32}
										/>
										<span className="sr-only">Your profile</span>
										<span aria-hidden="true">{session?.user?.name}</span>
									</a>
								</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-indigo-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
					<button
						type="button"
						onClick={() => setSidebarOpen(true)}
						className="-m-2.5 p-2.5 text-indigo-200 lg:hidden"
					>
						<span className="sr-only">Open sidebar</span>
						<Bars3Icon aria-hidden="true" className="h-6 w-6" />
					</button>
					<div className="flex-1 text-sm font-semibold leading-6 text-white">
						Dashboard
					</div>
					<a href="#">
						<span className="sr-only">Your profile</span>
						<img
							alt=""
							src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							className="h-8 w-8 rounded-full bg-indigo-700"
						/>
					</a>
				</div>

				<main className="py-10 lg:pl-72">
					<div className="px-4 sm:px-6 lg:px-8">{children}</div>
				</main>
			</div>
		</>
	) : (
		login()
	);
}
