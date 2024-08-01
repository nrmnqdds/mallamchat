import { db } from "@/drizzle";
import { chats } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const body = await request.json();

	console.log(body);

	await db
		.update(chats)
		.set({
			contents: body.input,
		})
		.where(eq(chats.id, body.id));

	return NextResponse.json({ message: "Chat updated" }, { status: 200 });
}
