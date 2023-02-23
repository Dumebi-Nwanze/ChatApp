import { useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "../AuthProvider";
import { auth, db } from "../firebaseConfig";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { FriendIdContext } from "../FriendIdProvider";
import ChatModel, { chatFromSnap, ChatType } from "../models/chatModel";
import "./styles/ChatDisplay.css";
import ChatProvider from "../ChatsProvider";
import ChatsList from "./ChatsList";

export const getRoomId = (ID_1: string, ID_2: string): string => {
  if (ID_1 > ID_2) {
    return ID_1 + ID_2;
  } else {
    return ID_2 + ID_1;
  }
};

function ChatDisplay() {
  const { friendId } = useContext(FriendIdContext);

  type MsgState = {
    msgs: ChatType[];
    msg: ChatType;
  };

  type MsgAction = {
    type: "ADD_TO_MSGS" | "SET_MSG";
    payload: ChatType;
  };

  const initialState: MsgState = {
    msgs: [],
    msg: {
      id: "",
      msg: "",
      sentBy: "",
      sentByID: "",
      sentAt: "",
    },
  };

  const [state, dispatch] = useReducer((state: MsgState, action: MsgAction) => {
    switch (action.type) {
      case "ADD_TO_MSGS":
        return {
          ...state,
          msg: {
            id: action.payload.id,
            msg: action.payload.msg,
            sentBy: action.payload.sentBy,
            sentByID: action.payload.sentByID,
            sentAt: action.payload.sentAt,
          },
        };
      case "SET_MSG":
        return {
          ...state,
          msgs: [
            ...state.msgs,
            {
              id: action.payload.id,
              msg: action.payload.msg,
              sentBy: action.payload.sentBy,
              sentByID: action.payload.sentByID,
              sentAt: action.payload.sentAt,
            },
          ],
          msg: {
            id: "",
            msg: "",
            sentBy: "",
            sentByID: "",
            sentAt: "",
          },
        };
    }
  }, initialState);

  return friendId === "" ? (
    <div className="nochatDisplay">
      <h2>No chat selected</h2>
    </div>
  ) : (
    <ChatProvider>
      <ChatsList friendId={friendId} />
    </ChatProvider>
  );
}

export default ChatDisplay;
