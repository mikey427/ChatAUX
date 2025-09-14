import "./App.css";
import { Link, Route, Switch } from "wouter";

function App() {
  return (
    <>
      <Link href="/users/1">Profile</Link>

      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* 
      Routes below are matched excsssively -
      the first matched route gets rendered
    */}
    </>
  );
}

export default App;
