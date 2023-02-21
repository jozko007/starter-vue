// import { firebase } from "@firebase/app";
// import "@firebase/firestore";
// var config = {
//     apiKey: "AIzaSyA3FohM7pRZqtTIxGnEglWuBRlqqCBbzhA",
//     authDomain: "ticketapp-f343e.firebaseapp.com",
//     databaseURL: "https://ticketapp-f343e.firebaseio.com",
//     projectId: "ticketapp-f343e",
//     storageBucket: "ticketapp-f343e.appspot.com",
//     messagingSenderId: "271636107684"
//   };
//   const firebaseApp = firebase.initializeApp(config);
//   export const firestore = firebaseApp.firestore();

import firebase from "firebase/app";
import "firebase/firestore";

var config = {
  apiKey: "AIzaSyAhyxZRS2ySXB5pfWj3rjwTHV9X65xNSYE",
  authDomain: "qr-vue.firebaseapp.com",
  databaseURL: "https://qr-vue-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "qr-vue",
  storageBucket: "qr-vue.appspot.com",
  messagingSenderId: "299993919730",
  appId: "1:299993919730:web:2a5ecfc9957455439fa06b"
  };

  const firebaseApp = firebase.initializeApp(config);
  console.log(firebaseApp);
  export const firestore = firebaseApp.firestore();