import React, { useState, useEffect } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  DataSnapshot,
  getDatabase,
  onChildAdded,
  ref,
  set,
} from "firebase/database";
import logoimage from "../images/로고2.png";
import moment from "moment";
import "moment/locale/ko";

function JoinGroup() {
  let boards = useSelector((state) => state.user.boards);
  const [boardRef, setboardRef] = useState(ref(getDatabase(), "board"));
  const [board, setboard] = useState(null);
  const [runlist, setrunlist] = useState(null);
  const id = useSelector((state) => state.user.currentUser);
  const norun = "모임이 없습니다.";
  let boardArray = [];
  const navigate = useNavigate();
  const [x, setX] = useState(null);
  const [open, setopen] = useState(false);
  const [weight, setweight] = useState(0);
  const [runtime, setruntime] = useState(0);

  //handleRadio
  const handleRadio = (e) => {
    setX(e.target.value);
    setopen(false);
  };

  if (boards.length > 1 && boards[0].no == 0) {
    boards.shift();
  }

  //로그아웃
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
  };
  //sessionStorge
  let sessionStorage = window.sessionStorage;
  useEffect(() => {
    let clean = true;
    //데이터베이스 board값 가져오기
    const AddBoardListeners = () => {
      onChildAdded(boardRef, (DataSnapshot) => {
        boardArray.push(DataSnapshot.val());
        boardArray.sort((a, b) => new Date(a.time) - new Date(b.time));
        setboard(boardArray);
        sessionStorage.setItem("board", JSON.stringify(boardArray));
        setboard(JSON.parse(sessionStorage.getItem("board")));
        filterfirstdate(boardArray);
      });
    };

    AddBoardListeners();
    return () => {
      clean = false;
    };
  }, []);

  //filter를 통한 내 참가 내역 가져오기
  const filterfirstdate = (boardArray) => {
    let result = [];
    if (boardArray) {
      //모든 모임들을 검사한다.
      for (var i = 0; i < boardArray.length; i++) {
        //참가자가 있는 경우
        if (boardArray[i].participant !== undefined) {
          //pariticipant 요소 중에 자신의 id가 있는지 확인
          let res = boardArray[i].participant.find(
            (element) => element == id.email
          );
          if (res) {
            result.push(boardArray[i]);
          }
        } else {
        }
      }
    }
    sessionStorage.setItem("runlist", JSON.stringify(result));
    setrunlist(JSON.parse(sessionStorage.getItem("runlist")));
  };
  const weightCheck = (v) => {
    let num = v || 0;
    //문자가 입력되면 값을 반영하지 않는다.
    if (!isFinite(num)) return;
    num = num.toString();
    //0보다 작은 값이면 안된다.
    if (num < 0) return;
    //입력받은 숫자가 0이거나 .이 없다면 0으로 시작되는 문자를 지운 상태로 반영
    if (num !== "0" && !num.includes(".")) {
      num = num.replace(/^0+/, "");
    }
    setweight(num);
  };

  const runtimeCheck = (v) => {
    let num = v || 0;
    //문자가 입력되면 값을 반영하지 않는다.
    if (!isFinite(num)) return;
    num = num.toString();
    //0보다 작은 값이면 안된다.
    if (num < 0) return;
    //입력받은 숫자가 0이거나 .이 없다면 0으로 시작되는 문자를 지운 상태로 반영
    if (num !== "0" && !num.includes(".")) {
      num = num.replace(/^0+/, "");
    }
    setruntime(num);
  };

  const handleweight = (e) => {
    weightCheck(e.target.value);
  };

  const handleruntime = (e) => {
    runtimeCheck(e.target.value);
  };

  //mainpage이동
  const mainpage = () => {
    navigate("/");
  };
  //mypage이동
  const mypage = () => {
    navigate("/MyPage");
  };
  const openstate = () => {
    if (x === null) {
      alert("선택해주세요");
    } else {
      setopen(!open);
    }
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

      <div id="list" className="listContainer">
        <ul>
          <div>
            <li className="textRun">
              <a>
                <div className="textDistance">
                  <p>선택</p>
                </div>
                <div className="textTime">
                  <p>날짜</p>
                </div>
                <div className="textTime">
                  <p>시간</p>
                </div>
                <div className="textPlace">
                  <p>장소</p>
                </div>
                <div className="textDistance">
                  <p>거리</p>
                </div>
              </a>
            </li>
          </div>
        </ul>
        <ul>
          {runlist && runlist.length != 0 ? (
            runlist.map((rowData) => (
              <div key={rowData.no}>
                <li className="listRun">
                  <div className="a">
                    <div className="listDistance">
                      <input
                        type="radio"
                        value={rowData.no}
                        checked={x == rowData.no}
                        onChange={handleRadio}
                      />
                    </div>
                    <div className="listTime">
                      <p>{rowData.date}</p>
                    </div>
                    <div className="listTime">
                      <p>{rowData.time.substr(0, 8)}</p>
                    </div>

                    <div className="listPlace">
                      <p>{rowData.place}</p>
                    </div>
                    <div className="listDistance">
                      <p>{rowData.distance + "km"}</p>
                    </div>
                  </div>
                </li>
              </div>
            ))
          ) : (
            <div style={{ marginTop: "50px", textAlign: "center" }}>
              <li className="listRun">
                <p>참가한 모임이 없습니다</p>
              </li>
            </div>
          )}
        </ul>

        <div className="resultcontainer">
          <div className="resultinput">
            <p>체중</p>
            <input
              name="weight"
              type="number"
              onChange={handleweight}
              value={weight}
            />
            <p>시간(분단위)</p>
            <input
              name="runtime"
              type="number"
              onChange={handleruntime}
              value={runtime}
            />
            <button className="w-btn w-btn-blue" onClick={() => openstate()}>
              칼로리 계산
            </button>
          </div>
          <div className="resultinput">
            {open ? (
              <div>
                체중 {weight} / 운동계수{(board[x].distance / 8) * 2} / 시간{" "}
                {runtime}분 {"->"} 결과=
                {weight * ((board[x].distance / 8) * 2) * (runtime / 15)}kcal
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div className="goback">
          <button className="w-btn w-btn-blue" onClick={() => mypage()}>
            뒤로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinGroup;
