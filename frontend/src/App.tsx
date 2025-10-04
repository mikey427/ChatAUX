import "./App.css";
import { Link, Route } from "wouter";
import Home from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Profile } from "./components/Profile";

function App() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
    </>
  );
}

export default App;
