import Particles from "@/components/ui/particles";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import PosthogProvider from "@/providers/posthog-provider";
import { QueryProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBanner from "@/components/top-banner";
import { WebVitals } from "@/components/web-vitals";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MaLLaM Chat",
	description:
		"Kecerdasan buatan yang boleh membantu menjawab soalan pengguna.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					inter.className,
					"min-h-screen bg-background antialiased",
				)}
			>
				<PosthogProvider>
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
								<WebVitals />
							</ThemeProvider>
						</SessionProvider>
					</QueryProvider>
				</PosthogProvider>
			</body>
		</html>
	);
}
