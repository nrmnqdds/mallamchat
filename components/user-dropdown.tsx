import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
import type { Session } from "next-auth";

const UserDropdown = ({ user }: { user: Session["user"] }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger aria-label="User Dropdown">
				<Avatar>
					<AvatarImage
						src={user?.image || "https://github.com/shadcn.png"}
						alt="Profile Picture"
					/>
					<AvatarFallback>{user?.name}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem>Billing</DropdownMenuItem>
				<DropdownMenuItem>Team</DropdownMenuItem>
				<DropdownMenuItem>Subscription</DropdownMenuItem>
				<DropdownMenuItem>
					<form
						action={async () => {
							"use server";
							await signOut();
						}}
					>
						<button type="submit">Sign Out</button>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserDropdown;
