import { db } from "@/drizzle";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db()),
	providers: [Google],
});
