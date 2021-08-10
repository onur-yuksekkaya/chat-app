import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Jumbotron,
  Spinner,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
import Moment from "moment";
import firebase from "../Firebase";

function RoomList() {
  const [room, setRoom] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [username, setUsername] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setUsername(localStorage.getItem("username"));
      firebase
        .database()
        .ref("rooms/")
        .on("value", (res) => {
          setRoom([]);
          setRoom(snapshotToArray(res));
          setShowLoading(false);
        });
    };

    fetchData();
  }, []);

  const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  };

  const enterChatRoom = (roomname) => {
    const chat = {
      roomname: "",
      username: "",
      message: "",
      date: "",
      type: "",
    };
    chat.roomname = roomname;
    chat.username = username;
    chat.date = Moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    chat.message = `${username} enter the room`;
    chat.type = "join";
    const newMessage = firebase.database().ref("chats/").push();
    newMessage.set(chat);

    firebase
      .database()
      .ref("roomusers/")
      .orderByChild("roomname")
      .equalTo(roomname)
      .on("value", (res) => {
        let roomuser = [];
        roomuser = snapshotToArray(res);
        const user = roomuser.find((x) => x.username === username);
        if (user !== undefined) {
          const userRef = firebase.database().ref("roomusers/" + user.key);
          userRef.update({ status: "online" });
        } else {
          const newroomuser = { roomname: "", username: "", status: "" };
          newroomuser.roomname = roomname;
          newroomuser.username = username;
          newroomuser.status = "online";
          const newRoomUser = firebase.database().ref("roomusers/").push();
          newRoomUser.set(newroomuser);
        }
      });

    history.push("/chatroom/" + roomname);
  };

  const logout = () => {
    localStorage.removeItem("username");
    history.push("/login");
  };

  return (
    <div>
      {showLoading && <Spinner color="primary" />}
      <Jumbotron>
        <h3>
          {username}{" "}
          <Button
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        </h3>
        <h2>Room List</h2>
        <div>
          <Link to="/addroom">Add Room</Link>
        </div>
        <ListGroup>
          {room.map((item, idx) => (
            <ListGroupItem
              key={idx}
              action
              onClick={() => {
                enterChatRoom(item.roomname);
              }}
            >
              {item.roomname}
            </ListGroupItem>
          ))}
        </ListGroup>
      </Jumbotron>
    </div>
  );
}
export default RoomList;
