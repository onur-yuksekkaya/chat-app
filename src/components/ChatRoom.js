import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardSubtitle,
  Button,
  Form,
  InputGroup,
  Input,
  InputGroupAddon,
} from "reactstrap";
import Moment from "moment";
import firebase from "../Firebase";
import ScrollToBottom from "react-scroll-to-bottom";
import "../Styles.css";

function ChatRoom() {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [roomname, setRoomname] = useState("");
  const [newchat, setNewchat] = useState({
    roomname: "",
    username: "",
    message: "",
    date: "",
    type: "",
  });
  const history = useHistory();
  const { room } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setUsername(localStorage.getItem("username"));
      setRoomname(room);
      firebase
        .database()
        .ref("chats/")
        .orderByChild("roomname")
        .equalTo(roomname)
        .on("value", (res) => {
          setChats([]);
          setChats(snapshotToArray(res));
        });
    };

    fetchData();
  }, [room, roomname]);

  useEffect(() => {
    const fetchData = async () => {
      setUsername(localStorage.getItem("username"));
      setRoomname(room);
      firebase
        .database()
        .ref("roomusers/")
        .orderByChild("roomname")
        .equalTo(roomname)
        .on("value", (resp) => {
          setUsers([]);
          const roomusers = snapshotToArray(resp);
          setUsers(roomusers.filter((x) => x.status === "online"));
        });
    };

    fetchData();
  }, [room, roomname]);

  const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  };

  const submitMessage = (e) => {
    e.preventDefault();
    const chat = newchat;
    chat.roomname = roomname;
    chat.username = username;
    chat.date = Moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    chat.type = "message";
    const newMessage = firebase.database().ref("chats/").push();
    newMessage.set(chat);
    setNewchat({ roomname: "", username: "", message: "", date: "", type: "" });
  };

  const onChange = (e) => {
    e.persist();
    setNewchat({ ...newchat, [e.target.name]: e.target.value });
  };

  const exitChat = (e) => {
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
    chat.message = `${username} leave the room`;
    chat.type = "exit";
    const newMessage = firebase.database().ref("chats/").push();
    newMessage.set(chat);

    firebase
      .database()
      .ref("roomusers/")
      .orderByChild("roomname")
      .equalTo(roomname)
      .once("value", (res) => {
        let roomuser = [];
        roomuser = snapshotToArray(res);
        const user = roomuser.find((x) => x.username === username);
        if (user !== undefined) {
          const userRef = firebase.database().ref("roomusers/" + user.key);
          userRef.update({ status: "offline" });
        }
      });

    history.goBack();
  };

  return (
    <div className="Container">
      <Container>
        <Row>
          <Col xs="4">
            <div>
              <Card className="UsersCard">
                <CardBody>
                  <CardSubtitle>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => {
                        exitChat();
                      }}
                    >
                      Exit Chat
                    </Button>
                  </CardSubtitle>
                </CardBody>
              </Card>
              {users.map((item, idx) => (
                <Card key={idx} className="UsersCard">
                  <CardBody>
                    <CardSubtitle>{item.username}</CardSubtitle>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Col>
          <Col xs="8">
            <ScrollToBottom className="ChatContent">
              {chats.map((item, idx) => (
                <div key={idx} className="MessageBox">
                  {item.type === "join" || item.type === "exit" ? (
                    <div className="ChatStatus">
                      <span className="ChatDate">{item.date}</span>
                      <span className="ChatContentCenter">{item.message}</span>
                    </div>
                  ) : (
                    <div className="ChatMessage">
                      <div
                        className={`${
                          item.username === username
                            ? "RightBubble"
                            : "LeftBubble"
                        }`}
                      >
                        {item.username === username ? (
                          <span className="MsgName">Me</span>
                        ) : (
                          <span className="MsgName">{item.username}</span>
                        )}
                        <span className="MsgDate"> at {item.date}</span>
                        <p>{item.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </ScrollToBottom>
            <footer className="StickyFooter">
              <Form className="MessageForm" onSubmit={submitMessage}>
                <InputGroup>
                  <Input
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Enter message here"
                    value={newchat.message}
                    onChange={onChange}
                  />
                  <InputGroupAddon addonType="append">
                    <Button variant="primary" type="submit">
                      Send
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Form>
            </footer>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ChatRoom;
