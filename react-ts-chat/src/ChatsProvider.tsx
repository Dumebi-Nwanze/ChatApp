import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { getRoomId } from "./components/ChatDisplay";
import { auth, db } from "./firebaseConfig";
import { FriendIdContext } from "./FriendIdProvider";
import ChatModel, { chatFromSnap, ChatType } from "./models/chatModel";

type Props = {
  children: React.ReactNode;
};
type ChatState = {
  chats: ChatType[];
  setChats: ([]: ChatType[]) => void; //change
};
export const ChatContext = createContext<ChatState>({
  chats: [],
  setChats: () => {},
});

export default function ChatProvider({ children }: Props) {
  const [chats, setChats] = useState<ChatType[]>([]);
  const { friendId } = useContext(FriendIdContext);
  useEffect(() => {
    const fetchMessages = async (friendID: string): Promise<void> => {
      const roomId = getRoomId(auth.currentUser!.uid, friendID);
      const q = query(
        collection(db, "chats", roomId, roomId + "chats"),
        orderBy("sentAt", "asc"),
        limit(40)
      );
      const querySnapshot = await getDocs(q);
      const roomChats: ChatModel[] = [];
      querySnapshot.forEach((doc) => {
        roomChats.push(chatFromSnap(doc));
      });

      setChats(roomChats);
    };
    fetchMessages(friendId);
  }, []);

  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
}
