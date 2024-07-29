"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

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
				<div className="absolute">
					<h1>Sidebarr</h1>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
