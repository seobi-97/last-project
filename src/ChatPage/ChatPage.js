import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

import { setChat } from "../redux/actions/user_action";
import ChatForm from "./ChatForm";
import ChatList from "./ChatList";
function ChatPage() {
  const { no } = useParams();
  const user = useSelector((state) => state.user.currentUser);
  const board = useSelector((state) => state.user.boards);
  let boardArray = [];
  const [message, setmessage] = useState([]);
  const dispatch = useDispatch();
  const [messageRef, setmessageRef] = useState(ref(getDatabase(), "message"));
  //sessionStorge
  let sessionStorage = window.sessionStorage;

  useEffect(() => {
    const AddBoardListeners = () => {
      onChildAdded(messageRef, (DataSnapshot) => {
        boardArray.push(DataSnapshot.val());
        setmessage(boardArray);
        sessionStorage.setItem("chat", JSON.stringify(boardArray));
      });
    };
    AddBoardListeners();
  }, []);
  return (
    <div className="listContainer">
      <div
        style={{
          width: "100%",
          height: "100px",
          border: ".2rem solid #ececec",
          borderRadius: "4px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        {no > 0 ? board[no - 1].date : board[no.date]}
      </div>
      <ChatList />
      <ChatForm />
    </div>
  );
}

export default ChatPage;
