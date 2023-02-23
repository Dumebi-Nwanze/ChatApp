import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { User } from "firebase/auth";
import UserModel, { UserInterface } from "./models/userModel";
import { fromSnap } from "./components/HomeScreen";

export const AuthContext = createContext<UserAuth | null>(null);

type Props = {
  children: ReactNode;
};

type UserAuth = {
  userAuth: User | null;
  userData: UserInterface | null;
};
export const AuthProvider = ({ children }: Props) => {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserModel | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUserAuth(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, "users", auth.currentUser!.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(fromSnap(docSnap));
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ userAuth, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
