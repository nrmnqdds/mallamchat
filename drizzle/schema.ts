import { relations, sql } from "drizzle-orm";
import {
	integer,
	sqliteTable,
	primaryKey,
	text,
	blob,
} from "drizzle-orm/sqlite-core";
import type { ChatCompletionMessageParam } from "mallam";
import type { AdapterAccount } from "next-auth/adapters";

export const users = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
	name: text("name"),
	email: text("email"),
	emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
	image: text("image"),
	password: text("password"),
});

export const accounts = sqliteTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccount["type"]>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => [
		primaryKey({ columns: [account.provider, account.providerAccountId] }),
	],
	// (account) => ({
	// 	compoundKey: primaryKey({
	// 		columns: [account.provider, account.providerAccountId],
	// 	}),
	// }),
);

export const sessions = sqliteTable("session", {
	sessionToken: text("sessionToken").notNull().primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
	},
	(vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
	// (vt) => ({
	// 	compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
	// }),
);

export const chats = sqliteTable("chats", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text("title").notNull(),
	contents: text("contents", { mode: "json" })
		.$type<ChatCompletionMessageParam[]>()
		.notNull(),
	user_id: text("user_id").notNull(),
	created_at: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const chats_new = sqliteTable("chats_new", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text("title").notNull(),
	contents: blob("contents", { mode: "json" })
		.$type<ChatCompletionMessageParam[]>()
		.notNull(),
	user_id: text("user_id").notNull(),
	created_at: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(chats),
}));

export const chatsRelations = relations(chats, ({ one }) => ({
	author: one(users, {
		fields: [chats.user_id],
		references: [users.id],
	}),
}));
