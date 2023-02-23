import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider";
import { ChatContext } from "../ChatsProvider";
import { auth, db } from "../firebaseConfig";
import ChatModel, { chatFromSnap, ChatType } from "../models/chatModel";
import { getRoomId } from "./ChatDisplay";
import "./styles/ChatDisplay.css";

type Props = {
  friendId: string;
};
function ChatsList({ friendId }: Props) {
  const chatsProvider = useContext(ChatContext);
  const user = useContext(AuthContext);
  const [chatText, setChatText] = useState<string>("");
  const sendMsg = async () => {
    if (chatText !== "") {
      const isoString = new Date().toISOString();
      const date = isoString.slice(0, 10) + " " + isoString.slice(11, 16);
      const chat = new ChatModel({
        id: crypto.randomUUID(),
        msg: chatText,
        sentBy: user?.userData?.name!,
        sentByID: auth.currentUser?.uid!,
        sentAt: date,
      });

      const roomId = getRoomId(auth.currentUser!.uid, friendId);
      const chatRoomRef = doc(db, "chats", roomId, roomId + "chats", chat.id);
      await setDoc(chatRoomRef, chat.toJson())
        .then(() => {
          chatsProvider.setChats([...chatsProvider.chats, chat]);
          setChatText("");
        })
        .catch((e) => console.log(e.message));
    }
  };
  useEffect(() => {
    const fetchMessages = async (friendID: string): Promise<void> => {
      const roomId = getRoomId(auth.currentUser!.uid ?? "", friendID);
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

      chatsProvider.setChats(roomChats);
    };
    const id = setInterval(() => {
      fetchMessages(friendId);
    }, 500);
    return () => {
      clearInterval(id);
    };
  }, []);
  return (
    <div className="chatDisplay">
      <div className="chats__list">
        {chatsProvider.chats.map((msg, i) => {
          const position =
            msg.sentByID === user?.userData?.id ? "right" : "left";

          return (
            <div key={msg.id} className={"msg__bubble" + " " + position}>
              <p>{msg.msg}</p>
            </div>
          );
        })}
      </div>
      <div className="textInput__container">
        <input
          type="text"
          className="textInput"
          value={chatText}
          onChange={(e) => {
            setChatText(e.target.value);
          }}
        />
        <button
          className="sendBtn"
          onClick={(e) => {
            sendMsg();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatsList;
