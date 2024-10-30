import { create } from "zustand";

const useStore = create((set) => ({
  chatroomId: 0,
  changeChatroomId: (changeId) => set((state) => ({ chatroomId: changeId })),
}));

export default useStore;
