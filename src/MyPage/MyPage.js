import React, { useState, useRef } from "react";
import profile from "../images/기본사용자.png";
import { useDispatch, useSelector } from "react-redux";
import { setPhotoURL } from "../redux/actions/user_action";
import { DataSnapshot, getDatabase, ref, update, set } from "firebase/database";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref as strRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { Box, TextField } from "@mui/material";
//import mime from "mime-types";

function MyPage() {
  const [Image, setImage] = useState(null);
  const [Text, setText] = useState(null);
  const fileInput = useRef();
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

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

  const onChangeText = async (e) => {
    setText(e.target.value);
  };
  const id = useSelector((state) => state.user.currentUser.uid);
  const changeImage = async (e) => {
    set(ref(getDatabase(), `users/${id}`), {
      name: "obb",
      image: Image,
      text: Text,
    });
  };
  {
    /*
    const changeImage2 = async (e) => {
    const file = e.target.files[0];
    const auth = getAuth();
    const user = auth.currentUser;

    const metadata = { contentType: mime.lookup(file.name) };
    const storage = getStorage();

    try {
      //스토리지에 파일 저장하기
      let uploadTask = uploadBytesResumable(
        strRef(storage, `user_image/${user.uid}`),
        file,
        metadata
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // 프로필 이미지 수정
            updateProfile(user, {
              photoURL: downloadURL,
            });

            dispatch(setPhotoURL(downloadURL));

            //데이터베이스 유저 이미지 수정
            update(ref(getDatabase(), `users/${user.uid}`), {
              image: downloadURL,
            });
          });
        }
      );
      // console.log('uploadTaskSnapshot', uploadTaskSnapshot)
    } catch (error) {
      console.log(error);
    }
  };
    */
  }

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
      </div>
      {/*<div className="profile">
        <img className="profileImg" src={user && user.photoURL} />
      </div>
      <div className="profileupload">
        <input
          ref={fileInput}
          type="file"
          name="file"
          onChange={onChange}
          accept="image/*"
        />
      </div>
        */}

      <div className="profiletext">
        <label>자기소개</label>
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
            defaultValue=""
            onChange={onChangeText}
          />
        </Box>
      </div>
      <button onClick={() => changeImage()}>등록하기</button>
    </div>
  );
}

export default MyPage;
