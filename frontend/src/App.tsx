import "./App.css";
import { Link, Route } from "wouter";
import Home from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";

function App() {
  return (
    <>
      <Link href="/users/1">Profile</Link>

      <Route path="/" component={Home} />
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
    </>
  );
}

export default App;
