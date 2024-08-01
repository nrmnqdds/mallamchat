import Sidebar from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";

const sp = Space_Grotesk({ display: "swap", subsets: ["latin"] });

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<main
			className={cn(
				"min-h-screen w-full bg-transparent flex-1 py-24",
				sp.className,
			)}
		>
			<Sidebar />
			{children}
		</main>
	);
};

export default PublicLayout;
