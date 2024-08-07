import LOGO from "@/assets/images/mallamchatlogo1.svg";
import { auth, signIn } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "./user-dropdown";

const Navbar = async () => {
	const session = await auth();
	return (
		<nav className="fixed w-full z-10 flex flex-row items-center justify-between p-5">
			<Link href="/" className="inline-flex items-center gap-2">
				<Image src={LOGO} alt="MaLLaM" width={20} height={20} />
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
