import { useContext, useEffect, useState } from "react";
import UserModel from "../models/userModel";
import "./styles/FriendsList.css";
import { collection, query, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { fromSnap } from "./HomeScreen";
import { FriendIdContext } from "../FriendIdProvider";
import { getRoomId } from "./ChatDisplay";
import ChatModel, { chatFromSnap } from "../models/chatModel";

const FriendsList: React.FC = () => {
  const [friendsList, setFriendsList] = useState<Array<UserModel>>([]);
  useEffect(() => {
    fetchFriendsList();
  }, []);

  const fetchFriendsList = async (): Promise<void> => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const friends: UserModel[] = [];
    querySnapshot.forEach((doc) => {
      let friend = fromSnap(doc);
      if (friend.id !== auth.currentUser!.uid) {
        friends.push(fromSnap(doc));
      }
    });
    setFriendsList(friends);
  };

  const friendIdState = useContext(FriendIdContext);
  return (
    <div className="friendList">
      <div className="friendList__title">
        <h2>Friends</h2>
        {friendIdState.friendId ? (
          <button
            className="close__chat"
            onClick={() => {
              friendIdState.setFriendId("");
            }}
          >
            Close chat
          </button>
        ) : null}
      </div>
      <div className="friendList__display">
        {friendsList.map((friend) => (
          <div
            key={friend.id}
            className="friendList__tile"
            onClick={() => {
              if (friendIdState.friendId !== "") {
                friendIdState.setFriendId("");
              } else {
                friendIdState.setFriendId(friend.id);
              }
            }}
          >
            <div className="circle__avatar"></div>
            <div className="listTile__title">
              <h3>{friend.name}</h3>
              <p>{"@" + friend.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
