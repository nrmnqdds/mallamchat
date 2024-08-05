import { Github, Twitter } from "lucide-react";
import Link from "next/link";

const socials = [
	{
		id: "github",
		icon: <Github color="white" />,
		url: "https://github.com/nrmnqdds/mallamchat",
	},
	{
		id: "twitter",
		icon: <Twitter color="white" />,
		url: "https://x.com/nrmnqdds",
	},
];

export default function Footer() {
	return (
		<footer className="bg-zinc-950">
			<div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
				<div className="flex justify-center space-x-6 md:order-2">
					{socials.map((social) => (
						<Link
							key={social.id}
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300 ease-in-out"
						>
							<span className="sr-only">{social.id}</span>
							{social.icon}
						</Link>
					))}
				</div>
				<div className="mt-8 md:order-1 md:mt-0">
					<p className="text-center text-xs leading-5 text-foreground">
						&copy; 2024 nrmnqdds. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
