import { create } from "zustand";

type TInitChatStore = {
	chat: string;
	createChat: (chat: string) => void;
};

export const useInitChatStore = create<TInitChatStore>((set) => ({
	chat: "",
	createChat: (chat) => set({ chat }),
}));
