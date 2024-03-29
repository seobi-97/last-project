import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPhotoURL } from "../redux/actions/user_action";
import {
  DataSnapshot,
  onChildAdded,
  getDatabase,
  ref,
  update,
  set,
} from "firebase/database";

import { setChat } from "../redux/actions/user_action";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import logoimage from "../images/로고2.png";
import { TbClick } from "react-icons/tb";
import {
  getStorage,
  ref as strRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import { setBoard } from "../redux/actions/user_action";
function MyPage() {
  const [change, setchange] = useState(null);
  const [Text, setText] = useState(null);
  const fileInput = useRef();
  const inputOpenImageRef = useRef();
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageRef, setmessageRef] = useState(ref(getDatabase(), "message"));

  const [message, setmessage] = useState([]);
  let boardArray = [];
  const onChange = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = fileInput.current.files[0];

    reader.readAsDataURL(file);
    //이미지 주소
    reader.onloadend = () => {
      setchange(reader.result);
    };
  };
  useEffect(() => {
    dispatch(setBoard(JSON.parse(sessionStorage.getItem("board"))));
  }, []);
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };
  const onChangeText = async (e) => {
    setText(e.target.value);
  };
  const id = useSelector((state) => state.user.currentUser.uid);
  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    const auth = getAuth();
    const user = auth.currentUser;

    const metadata = { contentType: file.type };
    const storage = getStorage();
    // https://firebase.google.com/docs/storage/web/upload-files#full_example
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
          console.log(error);
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
            console.log(downloadURL);
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
    } catch (error) {
      console.log(error);
    }
  };
  //로그아웃
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
  };
  //mainpage이동
  const mainpage = () => {
    navigate("/");
  };
  //mypage이동
  const mypage = () => {
    navigate("/MyPage");
  };
  const mygroup = () => {
    navigate("/MyGroup");
  };
  const joingroup = () => {
    navigate("/JoinGroup");
  };
  const result = () => {
    navigate("/ResultPage");
  };

  return (
    <div>
      <div className="header">
        <img src={logoimage} />
        <nav>
          <ul>
            <li>
              <a onClick={() => mainpage()}>Home</a>
            </li>
            <li className="active">
              <a onClick={() => mypage()}>MyPage</a>
            </li>
            <li>
              <a onClick={() => handleLogout()}>Logout</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="WhiteBox">
        <div className="MyPageFormBlock">
          <div className="LineBlock">
            <div className="FullLine">
              <div className="profile">
                <img
                  className="profileImg"
                  src={change ? change : user.photoURL}
                ></img>
              </div>
              <div className="TextBox">
                <p>{user.displayName}님 반갑습니다</p>
                <div className="profileupload">
                  <button className="w-btn" onClick={handleOpenImageRef}>
                    프로필 사진 변경
                  </button>
                </div>
                <input
                  onChange={handleUploadImage}
                  accept="image/jpeg, image/png"
                  style={{ display: "none" }}
                  ref={inputOpenImageRef}
                  type="file"
                />
                <div></div>
              </div>
            </div>
            <div className="HalfLine">
              <p onClick={() => mygroup()}>생성 모임 내역 </p>
              <TbClick />
            </div>
            <div className="HalfLine">
              <p onClick={() => joingroup()}>참가 모임 내역 </p>
              <TbClick />
            </div>
            <div className="HalfLine">
              <p onClick={() => result()}>운동 결과</p>
              <TbClick />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
