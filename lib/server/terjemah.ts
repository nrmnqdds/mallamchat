"use server";

import { mallam } from "@/lib/mallam";

export async function Terjemah(input: string) {
	const result = await mallam.translate(input);

	return result;
}
