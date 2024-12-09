import ChatPage from "./chat-page";

const ChatPageServer = async ({
	params,
}: { params: Promise<{ id: string }> }) => {
	const pageID = (await params).id;

	return <ChatPage pageID={pageID} />;
};

export default ChatPageServer;
