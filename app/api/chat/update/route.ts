import { db } from "@/drizzle";
import { chats_new } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const body = await request.json();

	console.log("update input: ", body.input);

	await db()
		.update(chats_new)
		.set({
			contents: body.input,
		})
		.where(eq(chats_new.id, body.id));

	return NextResponse.json({ message: "Chat updated" }, { status: 200 });
}
