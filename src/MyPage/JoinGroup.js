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
        //console.log(boardArray);
        //console.log(board);
        boardArray.sort((a, b) => new Date(a.time) - new Date(b.time));
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

  //filter를 통한 내 참가 내역 가져오기
  const filterfirstdate = (boardArray) => {
    if (boardArray) {
      for (var i = 0; i < boardArray.length; i++) {
        if (boardArray[i].participant !== undefined) {
          let res = boardArray[i].participant.find((element) => {
            return element == id.email;
          });
          console.log(res);
        }
      }

      {
        /*
       
      const result = boardArray.filter((board) => board.id == id.email);
      sessionStorage.setItem("runlist", JSON.stringify(res));
      setrunlist(JSON.parse(sessionStorage.getItem("runlist")));
    */
      }
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
  const remove = (data) => {};

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
          {/*틀 만들기/생성부분 입력부분에 맞는 라이브러리 추가하기 */}
          {runlist && runlist.length != 0 ? (
            runlist.map((rowData) => (
              <div key={rowData.no}>
                <li className="listRun">
                  <a>
                    <div className="listTime">
                      <p>{rowData.date}</p>
                    </div>
                    <div className="listTime">
                      <p>{rowData.time}</p>
                    </div>
                    <div className="listId">
                      <p>{rowData.id}</p>
                    </div>
                    <div className="listPlace">
                      <div className="matchTitle">
                        <h3>{rowData.place}</h3>
                      </div>
                    </div>
                    <div className="listDistance">
                      <p>{rowData.distance + "km"}</p>
                    </div>
                    <div>
                      <button>삭제</button>
                      <button>수정</button>
                    </div>
                  </a>
                </li>
              </div>
            ))
          ) : (
            <div>
              <li className="listRun">
                <p>참가한 모임이 없습니다</p>
              </li>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default JoinGroup;
