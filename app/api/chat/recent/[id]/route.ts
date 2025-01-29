import { db } from "@/drizzle";
import { chats_new } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const routeID = (await params).id;

	const res = await db()
		.select()
		.from(chats_new)
		.where(eq(chats_new.user_id, routeID))
		.orderBy(desc(chats_new.created_at))
		.limit(5);

	// console.log(res);

	if (!res) {
		return NextResponse.json({ error: "Chat not found" }, { status: 404 });
	}

	return NextResponse.json(res, { status: 200 });
}
