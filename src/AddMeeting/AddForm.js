import React ,{ useEffect, useState} from 'react';
import { connect, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { boardSave } from '../redux/actions/user_action';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useNavigate} from "react-router-dom";
import { map } from '@firebase/util';
import Searchplace from './Searchplace';



function AddForm() {
  const { register, formState: {errors}, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit]=useState("");
  const [loading, setLoading] =useState(false);

  
  const [time, settime]=useState("");
  const [place, setplace]=useState("");
  const [distance, setdistance]=useState("");
  const [people, setpeople]=useState("");

  const dispatch=useDispatch();
  let navigate=useNavigate();

  const onSave=()=>{
    const inputdata={
      time:time,
      place:place,
      distance:distance,
      people:people,
    }
    try{
      setLoading(true)
      dispatch(boardSave(inputdata))
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
        <Searchplace/>
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
        <button type='button' onClick={onSave}>제출</button>
      </div>

    </div>
  )
}

export default AddForm;
