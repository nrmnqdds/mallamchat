"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		// Provide the client to your App
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
