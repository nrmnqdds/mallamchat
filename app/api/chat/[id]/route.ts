import { db } from "@/drizzle";
import { chats } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const res = await db
		.select()
		.from(chats)
		.where(eq(chats.id, params.id))
		.then((res) => res[0]);

	if (!res) {
		return NextResponse.json({ error: "Chat not found" }, { status: 404 });
	}

	return NextResponse.json(res, { status: 200 });
}
