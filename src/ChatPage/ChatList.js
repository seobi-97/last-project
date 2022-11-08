import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DataSnapshot,
  getDatabase,
  onChildAdded,
  ref,
  set,
  remove,
  push,
  child,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../firebase";
import { async } from "@firebase/util";
import { connect } from "react-redux";
import Message from "./Message";
import { setChat } from "../redux/actions/user_action";

function ChatList() {
  const { no } = useParams();
  const user = useSelector((state) => state.user.currentUser);
  const board = useSelector((state) => state.user.boards);
  const [messageRef, setmessageRef] = useState(ref(getDatabase(), "message"));
  let boardArray = [];
  const [message, setmessage] = useState(
    JSON.parse(sessionStorage.getItem("chat"))
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const AddBoardListeners = () => {
      onChildAdded(messageRef, (DataSnapshot) => {
        boardArray.push(DataSnapshot.val());
        setmessage(boardArray);
        sessionStorage.setItem("chat", JSON.stringify(boardArray));
        console.log(boardArray);
      });
      dispatch(setChat(boardArray));
    };
    AddBoardListeners();
  }, []);

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "450px",
          border: ".2rem solid #ececec",
          borderRadius: "4px",
          padding: "1rem",
          marginBottom: "1rem",
          overflowY: "auto",
        }}
      >
        {message.length > 0 &&
          message.map((message) => (
            <Message
              key={message.timestamp}
              message={message}
              user={message.user}
            />
          ))}
      </div>
    </div>
  );
}

export default ChatList;
