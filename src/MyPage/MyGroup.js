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
  child,
  remove,
  update,
  get,
} from "firebase/database";
import firebase from "../firebase";
import logoimage from "../images/로고2.png";
import moment from "moment";
import "moment/locale/ko";

function MyGroup() {
  let boards = useSelector((state) => state.user.boards);
  const [boardRef, setboardRef] = useState(ref(getDatabase(), "board"));
  const [board, setboard] = useState(null);
  const [runlist, setrunlist] = useState(null);
  const id = useSelector((state) => state.user.currentUser);
  const norun = "모임이 없습니다.";

  let boardArray = [];

  const navigate = useNavigate();

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

  //filter를 통한 내 생성 내역 가져오기
  const filterfirstdate = (boardArray) => {
    if (boardArray) {
      const result = boardArray.filter((board) => board.id == id.email);
      result.sort((a, b) => a.time.substr(3, 2) - b.time.substr(3, 2));
      result.sort((a, b) => a.time.substr(0, 2) - b.time.substr(0, 2));
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
      sessionStorage.setItem("runlist", JSON.stringify(result));
      setrunlist(JSON.parse(sessionStorage.getItem("runlist")));
    }
  };

  //삭제
  const remove = (data) => {
    const board = JSON.parse(sessionStorage.getItem("board"));
    //전체 데이터 중 no값이 다른 것들 filter
    const newdata = board.filter((board) => board.no != data.no);
    //data.no보다 작은 부분은 냅두고 나머지만 다시 concat이용
    for (var i = data.no; i < board.length - 1; i++) {
      newdata[i] = { ...newdata[i], no: i };
    }
    alert("삭제 완료");
    set(ref(getDatabase(), `board`), {
      ...newdata,
    });
    window.location.href = "/MyGroup";
  };

  //mainpage이동
  const mainpage = () => {
    navigate("/");
  };
  //mypage이동
  const mypage = () => {
    navigate("/MyPage");
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
          {runlist && runlist.length != 0 ? (
            runlist.map((rowData) => (
              <div key={rowData.no}>
                <li className="listRun">
                  <div className="a">
                    <div className="listTime">
                      <p>{rowData.date}</p>
                    </div>
                    <div className="listTime">
                      <p>{rowData.time.substr(0, 8)}</p>
                    </div>
                    <div className="listId">
                      <p>{rowData.id}</p>
                      <div className="listParticipant">
                        {rowData.participant ? (
                          rowData.participant.map((data) => (
                            <div key={data}>
                              <span>[{data}]</span>
                            </div>
                          ))
                        ) : (
                          <p></p>
                        )}
                      </div>
                    </div>
                    <div className="listPlace">
                      <p>{rowData.place}</p>
                    </div>
                    <div className="listDistance">
                      <p>{rowData.distance + "km"}</p>
                    </div>
                    <div className="listButton2">
                      <Link to={`/EditPage/${rowData.no}`}>
                        <button className="w-btn w-btn-blue">수정</button>
                      </Link>
                      <button
                        className="w-btn w-btn-pink"
                        onClick={() => remove(rowData)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </li>
              </div>
            ))
          ) : (
            <div style={{ marginTop: "50px", textAlign: "center" }}>
              <li className="listRun">
                <p>생성한 모임이 없습니다</p>
              </li>
            </div>
          )}
        </ul>
        <div className="goback">
          <button className="w-btn w-btn-blue" onClick={() => mypage()}>
            뒤로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyGroup;
