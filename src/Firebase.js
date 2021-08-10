import firebase from "firebase/app";
//import * as firebase from "firebase";
import "firebase/firestore";
require("firebase/database");

const settings = { timestampsInSnapshots: true };

firebase.initializeApp({
  apiKey: "AIzaSyAgbaHRDaY8kbj37Qgo12USlsR29YXLTrE",
  authDomain: "chat-app-kodin21.firebaseapp.com",
  databaseURL:
    "https://chat-app-kodin21-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-app-kodin21",
  storageBucket: "chat-app-kodin21.appspot.com",
  messagingSenderId: "423957546130",
  appId: "1:423957546130:web:33feb93f032d85027d524b",
  measurementId: "G-4YS434NP19",
});

firebase.firestore().settings(settings);

export const firebaseRef = firebase;
export const db = firebase.firestore();
export default firebase;
