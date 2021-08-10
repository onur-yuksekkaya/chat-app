import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Jumbotron,
  Spinner,
  Form,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import firebase, { db, firebaseRef } from "../Firebase";

function Login() {
  const history = useHistory();
  const [creds, setCreds] = useState({ username: " " });
  const [showLoading, setShowLoading] = useState(false);

  const onChange = (e) => {
    e.persist();
    setCreds({ ...creds, [e.target.username]: e.target.value });
  };

  const ref = firebase.database().ref("users/");
  const Login = (e) => {
    e.preventDefault();
    setShowLoading(true);
    ref
      .child("username")
      .equalTo(creds.username)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          localStorage.setItem("username", creds.username);
          history.push("/roomlist");
          setShowLoading(false);
        } else {
          const newUser = firebase.database().ref("users/").push();
          newUser.set(creds);
          localStorage.setItem("username", creds.username);
          history.push("/roomlist");
          setShowLoading(false);
        }
      });
  };
  return (
    <div>
      {showLoading && <Spinner color="primary" />}
      <Jumbotron>
        <Form onSubmit={Login}>
          <FormGroup>
            <Label>username: </Label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Enter Your Username"
              value={creds.username}
              onChange={onChange}
            />
          </FormGroup>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Jumbotron>
    </div>
  );
}

export default Login;
