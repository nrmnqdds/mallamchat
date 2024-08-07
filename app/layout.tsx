import Particles from "@/components/ui/particles";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Viewport } from "next";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter as FontSans } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import TopBanner from "@/components/top-banner";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const viewport: Viewport = {
	initialScale: 1,
	width: "device-width",
	maximumScale: 1,
	viewportFit: "cover",
};

export const metadata: Metadata = {
	title: "MaLLaM Chat",
	description:
		"Chat with Malaysian AI about anything within Malaysian context.",
	metadataBase: new URL("https://mallam.chat/"),
	openGraph: {
		type: "website",
		url: "https://mallam.chat",
		title: "Mallam Chat",
		description:
			"Chat with Malaysian AI about anything within Malaysian context.",
		siteName: "Mallam Chat",
		images: "https://r2.studyjom.nrmnqdds.com/mallamchatog.png",
	},
	twitter: {
		card: "summary_large_image",
		site: "@nrmnqdds",
		creator: "@nrmnqdds",
		title: "Mallam Chat",
		description:
			"Chat with Malaysian AI about anything within Malaysian context.",
		images: "https://r2.studyjom.nrmnqdds.com/mallamchatog.png",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en" suppressHydrationWarning>
			<Script
				defer
				src="https://umami.mallam.chat/getinfo"
				data-website-id="eb05f1ec-536d-4f73-b9bc-f85f1a80b133"
			/>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
				)}
			>
				<QueryProvider>
					<SessionProvider session={session}>
						<ThemeProvider
							attribute="class"
							defaultTheme="dark"
							disableTransitionOnChange
						>
							<TopBanner />
							{children}
							<Toaster />
							<Particles
								className="absolute inset-0 -z-10"
								quantity={50}
								ease={70}
								size={0.05}
								staticity={40}
								color="#ffffff"
							/>
						</ThemeProvider>
					</SessionProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
