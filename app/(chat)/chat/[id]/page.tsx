import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import ChatPage from "./chat-page";

const ChatPageServer = async ({
	params,
}: { params: Promise<{ id: string }> }) => {
	const pageID = (await params).id;

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["init-chat", pageID],
		queryFn: async () => {
			const res = await fetch(`/api/chat/${pageID}`);
			const json = await res.json();
			return json;
		},
	});

	// useQuery({
	// 	queryKey: ["init-chat"],
	// 	queryFn: async () => {
	// 		const res = await fetch(`/api/chat/${pageID}`);
	// 		const json = await res.json();
	// 		if (json.contents.length > 1) {
	// 			setOutput(json.contents);
	// 			createChat("");
	// 			return input;
	// 		}
	// 		startStream({
	// 			input: chat,
	// 			history: json.contents.length > 1 ? json : [],
	// 		});
	// 		return input;
	// 	},
	// 	retry: false,
	// 	refetchOnWindowFocus: false,
	// });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ChatPage pageID={pageID} />
		</HydrationBoundary>
	);
};

export default ChatPageServer;
