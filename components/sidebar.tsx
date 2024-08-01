"use client";

import { Card } from "@/components/ui/card";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { chats } from "@/drizzle/schema";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createSelectSchema } from "drizzle-zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { z } from "zod";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { data: session } = useSession();

	const TChat = createSelectSchema(chats);

	const { data: recentChats, isFetching } = useQuery({
		queryKey: ["recent-chats"],
		queryFn: async () => {
			const res = await fetch(`/api/chat/recent/${session?.user?.id}`);
			const json = await res.json();
			return json;
		},
	});

	return (
		<div
			onMouseEnter={() => setIsOpen(true)}
			className="z-20 h-full w-24 absolute left-0 top-0"
		>
			<div
				className={cn(
					"relative transform h-full bg-zinc-900 border-border flex-col items-start justify-between animate-fade-in transition-all ease-in-out duration-300",
					isOpen ? "w-64 border flex" : "w-0 hidden",
				)}
				onMouseLeave={() => setIsOpen(false)}
			>
				<div className="absolute flex flex-col w-full gap-3 p-2">
					{isFetching ? (
						<p>Loading...</p>
					) : recentChats.length > 0 ? (
						recentChats.map((chat: z.infer<typeof TChat>) => (
							<Link key={chat.id} href={`/chat/${chat.id}`} passHref>
								<Card className="w-full p-2 hover:bg-gradient-to-tr hover:from-border hover:to-background transition-colors duration-150">
									<p>{chat.title}</p>
								</Card>
							</Link>
						))
					) : (
						<p>No recent chats</p>
					)}
				</div>
				{/* <Menubar className="absolute bottom-0 w-full p-2"> */}
				{/* 	<MenubarMenu> */}
				{/* 		<MenubarTrigger className="w-full flex flex-row items-center gap-2"> */}
				{/* 			<Image */}
				{/* 				src={session?.user?.image || "https://github.com/shadcn.png"} */}
				{/* 				alt="User Image" */}
				{/* 				width={24} */}
				{/* 				height={24} */}
				{/* 			/> */}
				{/* 			<p className="text-primary">{session?.user?.name}</p> */}
				{/* 		</MenubarTrigger> */}
				{/* 		<MenubarContent> */}
				{/* 			<MenubarItem */}
				{/* 				className="flex flex-row items-center gap-2" */}
				{/* 				onClick={async () => { */}
				{/* 					await signOut(); */}
				{/* 				}} */}
				{/* 			> */}
				{/* 				<p className="text-primary">Sign Out</p> */}
				{/* 			</MenubarItem> */}
				{/* 		</MenubarContent> */}
				{/* 	</MenubarMenu> */}
				{/* </Menubar> */}
			</div>
		</div>
	);
};

export default Sidebar;
