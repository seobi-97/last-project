import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { boardSave } from "../redux/actions/user_action";
import { ko } from "date-fns/esm/locale";
import { useNavigate } from "react-router-dom";
import { map } from "@firebase/util";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Searchplace from "./Searchplace";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import {
  DataSnapshot,
  getDatabase,
  onChildAdded,
  ref,
  set,
} from "firebase/database";

function AddForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const [loading, setLoading] = useState(false);

  const [count, setcount] = useState(0);
  const [boardRef, setboardRef] = useState(ref(getDatabase(), "board"));
  const [date, setdate] = useState(new Date());
  const [time, settime] = useState("");
  const [place, setplace] = useState("");
  const [distance, setdistance] = useState(0);
  const [people, setpeople] = useState(0);

  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    AddBoardListeners();
  }, []);
  //데이터베이스 board값 가져오기
  const AddBoardListeners = () => {
    let boardArray = [];
    onChildAdded(boardRef, (DataSnapshot) => {
      boardArray.push(DataSnapshot.val());
      increase(boardArray);
    });
  };

  //새로 추가를 위한
  const increase = (boardArray) => {
    setcount(count + boardArray.length);
  };

  //로그인할때 넘어왔던 값을 이용하기 위해 가져왔다.
  const id = useSelector((state) => state.user.currentUser.email);
  const onSave = (e) => {
    const inputdata = {
      id: id,
      no: count,
      date: date,
      time: time,
      place: place,
      distance: distance,
      people: people,
      participant: [],
    };
    try {
      setLoading(true);
      dispatch(boardSave(inputdata));
      //고유값을 줘서 데이터베이스에 저장시켜야함, 또한 데이터베이스 어느부분에 저장할 건지
      //따로 값을 설정해서 모임을 생성한 사람만이 모임 삭제를 할 수 있어야하며,
      //삭제시 다른 이용자들에게 안내 메세지를 주어야한다.
      //
      console.log(time);
      set(ref(getDatabase(), `board/${count}`), {
        id: id,
        no: count,
        date: date.toLocaleDateString(),
        time: time.toTimeString(),
        place: place,
        distance: distance,
        people: people,
        participant: [],
      });
      setdate(new Date());
      settime("");
      setplace(0);
      setdistance(0);
      setpeople("");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setErrorFromSubmit(error.message);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  };

  const distanceCheck = (v) => {
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
    setdistance(num);
  };

  const peopleCheck = (v) => {
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
    setpeople(num);
  };

  const handledistance = (e) => {
    distanceCheck(e.target.value);
  };
  const handlepeople = (e) => {
    peopleCheck(e.target.value);
  };
  const getData1 = (place) => {
    setplace(place);
  };

  return (
    <div>
      <div style={{ marginTop: 30 }}>
        <h2 style={{ textAlign: "center" }}>모임 생성</h2>
      </div>
      <Container style={{ marginTop: 50 }} maxWidth="md">
        <Box className="add" sx={{ flexGrow: 1 }}>
          <div className="addForm">
            <Grid container spacing={2} style={{ marginBottom: 50 }}>
              <Grid xs={6}>
                <label>Date</label>
              </Grid>
              <Grid xs={6}>
                <label>Time</label>
              </Grid>
              <Grid xs={6}>
                <DatePicker
                  selected={date}
                  selectsStart
                  locale={ko}
                  dateFormat="yyyy/MM/dd"
                  onChange={(date) => setdate(date)}
                />
              </Grid>
              <Grid xs={6}>
                <DatePicker
                  selected={time}
                  onChange={(time) => settime(time)}
                  locale={ko}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={10}
                  timeCaption="Time"
                  dateFormat="H:mm"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginBottom: 100 }}>
              <Grid xs={6}>
                <label>Distance</label>
              </Grid>
              <Grid xs={6}>
                <label>People</label>
              </Grid>
              <Grid xs={6}>
                <input
                  name="Distance"
                  type="number"
                  onChange={handledistance}
                  value={distance}
                />
              </Grid>
              <Grid xs={6}>
                <input
                  name="People"
                  type="number"
                  onChange={handlepeople}
                  value={people}
                />
              </Grid>
            </Grid>
          </div>
          <div>
            <br />
            <label>Place</label>
            <br />
            <Searchplace place1={place} getData1={getData1} />
          </div>

          <div className="submitbutton">
            <button type="button" onClick={() => onSave()}>
              제출
            </button>
          </div>
        </Box>
      </Container>
    </div>
  );
}

export default AddForm;
