import { auth, signIn } from "@/lib/auth";
import Link from "next/link";
import UserDropdown from "./user-dropdown";

const Navbar = async () => {
	const session = await auth();
	return (
		<nav className="fixed w-full z-10 flex flex-row items-center justify-between p-5">
			<Link href="/">
				<h1 className="text-2xl font-bold">MaLLaMChat</h1>
			</Link>
			{session ? (
				<UserDropdown user={session.user} />
			) : (
				<form
					action={async () => {
						"use server";
						await signIn("google");
					}}
				>
					<button type="submit">Sign in</button>
				</form>
			)}
		</nav>
	);
};

export default Navbar;
