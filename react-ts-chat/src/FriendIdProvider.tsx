import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Props = {
  children: React.ReactNode;
};
type FriendIdState = {
  friendId: string;
  setFriendId: (value: string) => void;
};
export const FriendIdContext = createContext<FriendIdState>({
  friendId: "",
  setFriendId: () => {},
});

export default function FriendProvider({ children }: Props) {
  const [friendId, setFriendId] = useState<string>("");

  return (
    <FriendIdContext.Provider value={{ friendId, setFriendId }}>
      {children}
    </FriendIdContext.Provider>
  );
}
