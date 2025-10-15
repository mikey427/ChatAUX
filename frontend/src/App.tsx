import "./App.css";
import { Link, Route } from "wouter";
import Home from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Profile } from "./components/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Route path="/">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
    </>
  );
}

export default App;
