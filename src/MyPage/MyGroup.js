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
  const usersRef = ref(getDatabase(), "board");
  let boardArray = [];
  //현재 days
  const currentDate = moment().format("YYYY-MM-D");
  const navigate = useNavigate();

  const matchDays = [];
  let iscurrent = false;
  for (var i = 0; i < 14; i++) {
    const addDate = moment().add(i, "days");
    const year = addDate.format("YYYY");
    const month = addDate.format("MM");
    const day = addDate.format("D");
    const weeks = ["일", "월", "화", "수", "목", "금", "토"];
    const yoil = weeks[addDate.weekday()];
    iscurrent = false;
    if (currentDate == addDate.format("YYYY-MM-D")) {
      iscurrent = true;
    }
    matchDays.push({
      id: i,
      year: year,
      month: month,
      day: day,
      yoil: yoil,
      iscurrent: iscurrent,
    });
  }
  //console.log(matchDays);
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
        //console.log(boardArray);
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

  //수정
  //데이터를 가져온 페이지에서 수정
  const onClick1 = (data) => {
    if (id == data.id) {
      navigate("/EditPage");
    } else {
      navigate("/");
    }
  };

  //취소

  //특정 result 데이터 선택-> result내 participant에서 유저값이 있으면 그것만 빼기
  //데이터 저장시
  const remove = (data) => {
    const board = JSON.parse(sessionStorage.getItem("board"));
    console.log(board[data.no]);
    const newdata = board.filter((board) => board.no != data.no);
    console.log(newdata);
    //data.no보다 작은 부분은 냅두고 나머지만 다시 concat이용
    for (var i = data.no; i < board.length - 1; i++) {
      newdata[i] = { ...newdata[i], no: i - 1 };
      console.log(newdata);
      alert("삭제 완료");
    }
    set(ref(getDatabase(), `board`), {
      ...newdata,
    });
    window.location.href = "/MyGroup";
    //remove(ref(getDatabase(), `board/${data.no}`));
    //set(ref(getDatabase(), `board/${data.no}`), {});
  };

  //mainpage이동
  const mainpage = () => {
    navigate("/");
  };
  //mypage이동
  const mypage = () => {
    navigate("/MyPage");
  };
  const editpage = (data) => {
    <Link to={`/EditPage/${data}`}></Link>;
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
          {/*틀 만들기/생성부분 입력부분에 맞는 라이브러리 추가하기 */}
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
                          <span>{rowData.participant}</span>
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
            <div>
              <li className="listRun">
                <p>생성한 모임이 없습니다</p>
              </li>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default MyGroup;
