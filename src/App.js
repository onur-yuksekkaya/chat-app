import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import RoomList from "./components/RoomList";
import AddRoom from "./components/AddRoom";
import ChatRoom from "./components/ChatRoom";

function App() {
  let location = useLocation();

  return (
    <Router>
      <div>
        <Redirect
          to={{
            pathname: "/roomList",
            state: { from: location },
          }}
        />
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <SecureRoute path="/roomList">
            <RoomList />
          </SecureRoute>
          <SecureRoute path="/addRoom">
            <AddRoom />
          </SecureRoute>
          <SecureRoute path="/chatroom/:room">
            <ChatRoom />
          </SecureRoute>
        </Switch>
      </div>
    </Router>
  );
}

function SecureRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem("username") ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default App;
