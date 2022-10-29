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
import { getCookie, setCookie, removeCookie } from "../Cookies";

function MainPage() {
  let boards = useSelector((state) => state.user.boards);
  const [boardRef, setboardRef] = useState(ref(getDatabase(), "board"));
  const [board, setboard] = useState(null);
  const id = useSelector((state) => state.user.currentUser);
  //console.log(id.uid);
  //console.log(boards);

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
  console.log(matchDays);
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
  let sessionStorge = window.sessionStorage;

  useEffect(() => {
    let clean = true;
    //데이터베이스 board값 가져오기
    const AddBoardListeners = () => {
      let boardArray = [];
      onChildAdded(boardRef, (DataSnapshot) => {
        boardArray.push(DataSnapshot.val());
        setboard(boardArray);
        //console.log(boardArray);
        //console.log(board);
      });
    };
    AddBoardListeners();
    return () => {
      clean = false;
    };
  }, []);

  //참가 신청
  const onClick = (data) => {
    //console.log(data);
    //console.log(parseInt(data.people));
    //console.log(data.participant.length);
    //모임에 설정된 사람 수보다 작아야된다.
    if (parseInt(data.people) > data.participant.length) {
      //참가자와 생성자가 다를 경우
      if (id !== data.id) {
        set(ref(getDatabase(), `board/${data.no}`), {
          ...data,
          participant: id,
        });
      }
    }
  };

  const navigate = useNavigate();
  //수정
  const onClick1 = (data) => {
    if (id == data.id) {
      navigate("/EditPage");
    } else {
      navigate("/");
    }
  };

  //취소
  const isMatch = (element) => {
    if (element.participant === id) {
      return true;
    }
  };
  //데이터중에서 유저값과 일치한 값이 있는지
  const onClick2 = (data) => {
    const test = data.filter(isMatch);
    //console.log(test);
    if (test) {
      //특정값 제거
      const participant = data.participant.filter((element) => element !== id);
      set(ref(getDatabase(), `board/${data.no}`), {
        ...data,
        participant: participant,
      });
    } else {
      return;
    }
  };

  //mypage이동
  const mypage = () => {
    navigate("/MyPage");
  };

  const test = (e) => {
    console.log(e.target.value);
  };
  let [btnActive, setBtnActive] = useState("");
  const clickdate = async (e) => {
    console.log(e.target.value);
    setBtnActive(e.target.value);
    return e.target.value;
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
          {board &&
            board.map((rowData) => (
              <div key={rowData.no}>
                <li className="listRun">
                  <a>
                    <div className="listTime">
                      <p>{rowData.time}</p>
                    </div>
                    <div className="listPlace">
                      <div className="matchTitle">
                        <h3>{rowData.place}</h3>
                      </div>
                    </div>
                    <div className="listDistance">
                      <p>{rowData.distance}</p>
                    </div>
                    <div>
                      <button onClick={() => onClick(rowData)}>신청</button>
                      <button onClick={() => onClick2(rowData)}>취소</button>
                      <button onClick={() => onClick1(rowData)}>수정</button>
                    </div>
                  </a>
                </li>
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default MainPage;
