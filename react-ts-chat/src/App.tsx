import { createContext, useContext } from "react";
import "./App.css";
import { AuthContext } from "./AuthProvider";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";

function App() {
  const user = useContext(AuthContext);
  return (
    <div className="App">
      {user?.userAuth ? <HomeScreen /> : <LoginScreen />}
    </div>
  );
}

export default App;
