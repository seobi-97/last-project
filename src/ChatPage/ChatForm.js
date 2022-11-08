import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
import moment from "moment";
import "moment/locale/ko";
import { setChat } from "../redux/actions/user_action";

function ChatForm() {
  const { no } = useParams();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const board = useSelector((state) => state.user.boards);
  const chat = useSelector((state) => state.user.message);
  console.log(board);
  const [boardRef, setboardRef] = useState(ref(getDatabase(), `board/${no}`));
  const [messageRef, setmessageRef] = useState(ref(getDatabase(), "message"));
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if (!content) {
      setErrors((prev) => prev.concat("Empty"));
      return;
    }
    setLoading(true);

    //firebase board내 메세지 저장
    try {
      await set(push(messageRef, "message"), createMessage());
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {}
  };

  const createMessage = () => {
    const message = {
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
      content: content,
      no: no,
    };
    const newdata = chat.concat(message);
    console.log(newdata);
    return message;
  };
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control
            value={content}
            onChange={handleChange}
            as="textarea"
            row={3}
          />
        </Form.Group>
      </Form>
      <Row>
        <Col>
          <button
            onClick={handleSubmit}
            className="sendbutton"
            style={{ width: "100%", marginTop: "10px" }}
          >
            SEND
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default ChatForm;
