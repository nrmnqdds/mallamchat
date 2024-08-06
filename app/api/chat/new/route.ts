import { db } from "@/drizzle";
import { chats } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { mallam } from "@/lib/mallam";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	const { input } = await request.json();

	const session = await auth();

	const title = await mallam.chatCompletion(
		[
			{
				role: "system",
				content:
					"Sila berikan tajuk yang sesuai kepada soalan berikut dalam 3 hingga 5 patah perkataan sahaja. Contoh: 'Bagaimana cara membuat kuih lapis?'",
			},
			{
				role: "user",
				content: input,
			},
		],
		{
			model: "mallam-tiny",
		},
	);

	const newContent = [
		{
			user: input,
		},
	];

	if (session?.user?.id) {
		// Insert the chat into the database
		const res = await db
			.insert(chats)
			.values({
				title: title.message.trim(),
				contents: newContent,
				user_id: session?.user.id,
			})
			.returning({ id: chats.id, title: chats.title })
			.then((res) => res[0]);

		return NextResponse.json(res, { status: 201 });
	}

	return NextResponse.json(
		{
			error: "Sila log masuk untuk menggunakan fungsi ini",
		},
		{ status: 401 },
	);
}
