import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Suspense } from "react";

export default function MarketingLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<Navbar />
			</Suspense>
			<main className="mx-auto flex-1 overflow-hidden">{children}</main>
			<Footer />
		</>
	);
}
