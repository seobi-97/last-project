import React, { useState, useRef } from "react";
import profile from "../images/기본사용자.png";
import { useSelector } from "react-redux";
import {
  DataSnapshot,
  getDatabase,
  onChildAdded,
  ref,
  set,
} from "firebase/database";
import { Box, TextField } from "@mui/material";

function MyPage() {
  const [Image, setImage] = useState(null);
  const fileInput = useRef();

  const onChange = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = fileInput.current.files[0];

    reader.readAsDataURL(file);
    //이미지 주소
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const id = useSelector((state) => state.user.currentUser.uid);
  const changeImage = async (e) => {
    set(ref(getDatabase(), `users/${id}`), {
      name: "obb",
      image: Image,
    });
  };
  return (
    <div className="profileform">
      <div className="profile">
        <img className="profileImg" src={Image ? Image : profile}></img>
      </div>
      <div className="profileupload">
        <input
          ref={fileInput}
          type="file"
          name="file"
          onChange={onChange}
          accept="image/*"
        />
        <button onClick={() => changeImage()}>등록하기</button>
      </div>
      <div className="profiletext">
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "55ch" } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-multiline-flexible"
            multiline
            rows={6}
            defaultValue="TextField"
          />
        </Box>
      </div>
    </div>
  );
}

export default MyPage;
