import { db } from "@/drizzle";
import { chats_new } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const res = await db
		.select()
		.from(chats_new)
		.where(eq(chats_new.id, params.id))
		.then((res) => res[0]);

	console.log(res);

	if (!res) {
		return NextResponse.json({ error: "Chat not found" }, { status: 404 });
	}

	return NextResponse.json(res, { status: 200 });
}
