import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChatPage from "./chatPage";

const Page = async ({ params }: { params: { id: string } }) => {
	const session = await auth();

	return session ? <ChatPage id={params.id} /> : redirect("/");
};

export default Page;
