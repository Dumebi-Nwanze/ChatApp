import React from "react";
import { useState } from "react";
import "./styles/LoginScreen.css";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import UserModel from "../models/userModel";

type Props = {};

function LoginScreen({}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const usersRef = collection(db, "users");

  const login = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      console.log(error.message);
    });
    setEmail("");
    setPassword("");
  };

  const signUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userModel = new UserModel({
          id: user.uid,
          name: name,
          email: user.email!,
        });
        await setDoc(doc(db, "users", user.uid), userModel.toJson()).catch(
          (error) => {
            alert(error.message);
          }
        );
      })
      .catch((error) => {
        alert(error.message);
      });
    setEmail("");
    setPassword("");
    setName("");
  };

  const showSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="loginScreen">
      <h1>Connect with friends and chat</h1>
      <div className="form__container">
        {!isSignUp ? (
          <form className="form">
            <input
              type="email"
              placeholder="Email"
              className="form__input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              className="form__input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              className="form__submitBtn"
              onClick={(e) => {
                e.preventDefault();
                login();
              }}
            >
              Login
            </button>
          </form>
        ) : (
          <form className="form">
            <input
              type="text"
              placeholder="Enter full name"
              className="form__input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="email"
              placeholder="Enter email"
              className="form__input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Enter password"
              className="form__input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              className="form__submitBtn"
              onClick={(e) => {
                e.preventDefault();
                signUp();
              }}
            >
              Signup
            </button>
          </form>
        )}

        {!isSignUp ? (
          <p>
            Don't have an account?{" "}
            <span className="signup_Btn" onClick={showSignUp}>
              {" "}
              Signup Now
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span className="signup_Btn" onClick={showSignUp}>
              {" "}
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
