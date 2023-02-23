import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import UserModel, { UserType } from "../models/userModel";
import { QueryDocumentSnapshot } from "firebase/firestore";
import "./styles/HomeScreen.css";
import FriendsList from "./FriendsList";
import ChatDisplay from "./ChatDisplay";
import FriendProvider, { FriendIdContext } from "../FriendIdProvider";

type Props = {};

export const fromSnap = (snap: QueryDocumentSnapshot): UserModel => {
  let data = snap.data();
  return new UserModel({
    id: data["id"],
    name: data["name"],
    email: data["email"],
  });
};

function HomeScreen({}: Props) {
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const friendIdState = useContext(FriendIdContext);
  useEffect(() => {
    const getUserDetails = async () => {
      const docRef = doc(db, "users", auth.currentUser!.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurrentUser(fromSnap(docSnap));
      } else {
        console.log("No such document!");
      }
    };
    getUserDetails();
  }, []);
  return (
    <div>
      <div className="app">
        <div className="appBar">
          <h1>Chat App</h1>
          <img
            src="data:image/jpeg;base64,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"
            alt="logout"
            className="logout__btn"
            onClick={() => {
              signOut(auth);
            }}
          />
        </div>
      </div>
      <FriendProvider>
        <div className="appBody">
          <FriendsList />
          <ChatDisplay />
        </div>
      </FriendProvider>
    </div>
  );
}
export default HomeScreen;
