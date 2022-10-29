import React ,{ useEffect, useState} from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { boardSave } from '../redux/actions/user_action';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useNavigate} from "react-router-dom";
import { map } from '@firebase/util';
import Searchplace from './Searchplace';
import firebase from '../firebase';
import { DataSnapshot, getDatabase, onChildAdded, ref, set } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import md5 from 'md5';

function EditForm() {
  const { register, formState: {errors}, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit]=useState("");
  const [loading, setLoading] =useState(false);

  const [count,setcount]=useState(0);
  const [boardRef, setboardRef]=useState(ref(getDatabase(),"board"));
  const [time, settime]=useState("");
  const [place, setplace]=useState("");
  const [distance, setdistance]=useState("");
  const [people, setpeople]=useState("");


  const dispatch=useDispatch();
  let navigate=useNavigate();
  
  
  useEffect(()=>{
    AddBoardListeners();
  },[])
  //데이터베이스 board값 가져오기
  const AddBoardListeners=()=>{
    let boardArray=[];
    onChildAdded(boardRef,DataSnapshot=>{
      boardArray.push(DataSnapshot.val());
      //setboardRef(boardArray)
      console.log(boardArray);
      console.log(boardArray.length)
      increase(boardArray)
    })
  }
  //새로 추가를 위한
  const increase=(boardArray)=>{
    setcount(count+boardArray.length);
  }

  //로그인할때 넘어왔던 값을 이용하기 위해 가져왔다.
  const id=useSelector(state=>state.user.currentUser.uid);
  

  const onSave=(e)=>{
    const inputdata={
      id:id,
      no:count,
      time:time,
      place:place,
      distance:distance,
      people:people,
      participant:"",
    }
    try{
      setLoading(true)
      dispatch(boardSave(inputdata))
      //고유값을 줘서 데이터베이스에 저장시켜야함, 또한 데이터베이스 어느부분에 저장할 건지
      //따로 값을 설정해서 모임을 생성한 사람만이 모임 삭제를 할 수 있어야하며, 
      //삭제시 다른 이용자들에게 안내 메세지를 주어야한다.
      //
      set(ref(getDatabase(),`board/${count}`),{
        id:id,
        no:count,
        time:time.toLocaleDateString(),
        place:place,
        distance:distance,
        people:people,
        participant:"",
      })

      settime("")
      setplace("")
      setdistance("")
      setpeople("")
      setLoading(false)
      navigate('/')
    }catch(error){
      setErrorFromSubmit(error.message)
      setLoading(false)
      setTimeout(()=>{
        setErrorFromSubmit("")
      },5000);
    }
  }

  
  const handledistance=(e)=>{
    setdistance(e.target.value)
  }
  const handlepeople=(e)=>{
    setpeople(e.target.value)
  }
  const getData1=(place)=>{
    setplace(place);
  }
  
  return (
    <div className="addpage">
      <div>
        <br/>
        <label>Time</label>
        <br/>
        
      </div>
      <div style={{width:'300px',height:'300px'}}>
        <DatePicker  selected={time} onChange={date=>settime(date)}/>
      </div>
      <div>
        <br/>
        <label>Place</label>
        <br/>
        <Searchplace place1={place} getData1={getData1}/>
      </div>
      <div>
        <br/>
        <label>Distance</label>
        <br/>
        <input name="Distance" onChange={handledistance} value={distance}/>
      </div>
      <div>
        <br/>
        <label>People</label>
        <br/>
        <input name="People" onChange={handlepeople} value={people}/>
      </div>
      <div>
        <br/>
        <button type='button' onClick={()=>onSave()}>제출</button>
      </div>

    </div>
  )
}

export default EditForm;
