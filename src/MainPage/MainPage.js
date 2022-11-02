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
import classnames from "classnames";

function MainPage() {
  let boards = useSelector((state) => state.user.boards);
  const [boardRef, setboardRef] = useState(ref(getDatabase(), "board"));
  const [board, setboard] = useState(null);
  const [runlist, setrunlist] = useState(null);
  const id = useSelector((state) => state.user.currentUser);
  const norun = "모임이 없습니다.";
  let boardArray = [];
  //현재 days
  const currentDate = moment().format("YYYY-MM-D");

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

  //filter를 통한 오늘 날짜 모임 가져오기
  const filterfirstdate = (boardArray) => {
    const nowTime = moment().format("yyyy. MM. D.");
    if (boardArray) {
      const result = boardArray.filter((board) => board.date == nowTime);
      sessionStorage.setItem("runlist", JSON.stringify(result));
      setrunlist(JSON.parse(sessionStorage.getItem("runlist")));
    }
  };

  //참가 신청
  const application = (data) => {
    let num = 0;
    //참가자 수
    if (data.participant) {
      num = data.participant.length;
      console.log(num);
    }

    //모임에 설정된 사람 수보다 현재 신청자수가 더 작아야된다.
    if (parseInt(data.people) > num) {
      //참가자와 생성자가 다를 경우
      if (id.email !== data.id) {
        //첫순서로 신청하는 경우
        if (data.participant === undefined) {
          set(ref(getDatabase(), `board/${data.no}`), {
            ...data,
            participant: [id.email],
          });
          alert("참가 신청");
        } else {
          let res = data.participant.find((element) => {
            return element == id.email;
          });
          if (res !== undefined) {
            alert("이미 참가중입니다.");
          } else {
            //기존 참가자와 신규 참가자를 같이 저장
            const newparticipant = data.participant.concat(id.email);
            console.log(newparticipant);
            set(ref(getDatabase(), `board/${data.no}`), {
              ...data,
              participant: newparticipant,
            });
            alert("참가 신청");
          }
        }
      } else {
        alert("모임 생성자입니다.");
      }
    } else {
      alert("참가 인원 초과");
    }
  };

  const navigate = useNavigate();
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
  const remove = (data) => {
    const board = JSON.parse(sessionStorage.getItem("board"));
    console.log(board[data.no].participant);
    const isMatch = board[data.no].participant.filter(
      (board) => board == id.email
    );
    console.log(isMatch);
    if (isMatch) {
      //특정값 제거
      const participant = data.participant.filter(
        (element) => element != id.email
      );
      set(ref(getDatabase(), `board/${data.no}`), {
        ...data,
        participant: participant,
      });
      alert("취소 완료");
    } else {
      alert("취소 실패");
    }
  };

  let [btnActive, setBtnActive] = useState("");
  const clickdate = async (e) => {
    setBtnActive(e.target.value);
    filterdate(matchDays[e.target.value]);
    return e.target.value;
  };

  //오늘날짜로 filter
  //값 비교후 filter
  const filterdate = (data) => {
    const item = data.year + ". " + data.month + ". " + data.day + ".";
    const result = board.filter((board) => board.date == item);
    console.log(result);
    if (result) {
      sessionStorage.setItem("runlist", JSON.stringify(result));
    } else {
      sessionStorage.setItem("runlist", JSON.stringify(norun));
    }

    setrunlist(JSON.parse(sessionStorage.getItem("runlist")));
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
            <li className="active">
              <a>Home</a>
            </li>
            <li>
              <a onClick={() => mypage()}>MyPage</a>
            </li>
            <li>
              <a onClick={() => handleLogout()}>Logout</a>
            </li>
          </ul>
        </nav>
      </div>

      <div id="dateNav" className="sub-header">
        <div className="tabWrap">
          <div className="swipe-tabs">
            <ul className="swipe-tab slick-initialized slick-slider">
              <div className="slick-list draggable">
                <div
                  className="slick-track"
                  style={{ opacity: 1, width: "800px", left: "0px" }}
                >
                  {matchDays &&
                    matchDays.map((date) => (
                      <li
                        key={date.id}
                        value={date.id}
                        id="datewrap"
                        onClick={clickdate}
                        className={classnames("dateWrap slickslide", {
                          isActive: date.id == btnActive ? "active" : "",
                        })}
                        style={{ minwidth: "23px" }}
                      >
                        {date.day}
                        <br />
                        {date.yoil}
                      </li>
                    ))}
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>

      <div id="list" className="listContainer">
        <div className="addproject">
          <Link className="link" to="/AddPage">
            모임 생성하기
          </Link>
        </div>
        <ul>
          {/*틀 만들기/생성부분 입력부분에 맞는 라이브러리 추가하기 */}
          {runlist &&
            runlist.map((rowData) => (
              <div key={rowData.no}>
                <li className="listRun">
                  <a>
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
                      <button onClick={() => application(rowData)}>신청</button>
                      <button onClick={() => remove(rowData)}>취소</button>
                      {/*<button onClick={() => onClick1(rowData)}>수정</button>*/}
                    </div>
                  </a>
                </li>
              </div>
            ))}
        </ul>
        {!sessionStorage.getItem("runlist") && (
          <div>
            <h3>모임이 없습니다</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
