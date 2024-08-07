import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();

	return session ? children : redirect("/");
};

export default ProtectedLayout;
