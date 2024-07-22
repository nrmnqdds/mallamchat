import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Tatabahasaly",
	description:
		"Kecerdasan buatan bagi memastikan tatabahasa yang betul dalam penulisan",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	return (
		<html lang="en" suppressHydrationWarning className="h-full bg-white">
			<body className={cn(inter.className, "h-full")}>
				<SessionProvider session={session}>{children}</SessionProvider>
			</body>
		</html>
	);
}
