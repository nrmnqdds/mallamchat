import { drizzle } from "drizzle-orm/libsql/web";
import { createClient } from "@libsql/client/web";
import * as schema from "./schema";

export const db = () => {
	console.log(process.env);

	const url = process.env.DATABASE_URL?.trim();
	if (url === undefined) {
		throw new Error("DATABASE_URL is not defined", url);
	}

	const authToken = process.env.DATABASE_AUTH_TOKEN?.trim();
	if (authToken === undefined) {
		throw new Error("DATABASE_AUTH_TOKEN is not defined");
	}

	return drizzle(
		createClient({
			url,
			authToken,
		}),
		{ schema },
	);
};

// const client = () =>
// 	createClient({
// 		url: process.env.DATABASE_URL,
// 		authToken: process.env.DATABASE_AUTH_TOKEN,
// 	});

// export const db = drizzle(client, { schema, logger: true });
