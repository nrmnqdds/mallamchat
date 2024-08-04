"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: "https://us.i.posthog.com",
		person_profiles: "identified_only",
		loaded: (posthog) => {
			if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
		},
	});
}

export default function PosthogProvider({
	children,
}: { children: React.ReactNode }) {
	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
