import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBanner from "@/components/top-banner";

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
            </ThemeProvider>
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
