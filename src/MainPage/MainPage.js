import React, { useState, useEffect } from 'react';
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link } from 'react-router-dom';

import {useSelector} from "react-redux";
import { DataSnapshot, getDatabase, onChildAdded, ref } from 'firebase/database';

function MainPage() {
  let boards=useSelector(state=>state.user.boards);
  const maxNo=useSelector(state=>state.user.maxNo);
  const [boardRef, setboardRef]=useState(ref(getDatabase(),"board"));
  console.log(boards);
  if(boards.length>1&&boards[0].no==0){
    boards.shift();
  }
  const handleLogout=()=>{
    const auth=getAuth();
    signOut(auth).then(()=>{

    }).catch((error)=>{

    })
  }
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
    })
  }
  const renderBoard=(board)=>{
    board.length>0&&
    board.map(row=>(
      <li>#{row.time}</li>
    ))
  }
  return (
    <div>
      <div>
        MainPage
        <button onClick={handleLogout}>로그아웃</button>
        <Link style={{color:'gray', textDecoration:'none'}} to="/AddPage">생성하기</Link>
      </div>
      <div>
        {/*틀 만들기/생성부분 입력부분에 맞는 라이브러리 추가하기 */}
        {maxNo!==1?boards&&boards.map((rowData)=>( 
          <div key={rowData.no}>
            <li>
                {rowData.no}
                {rowData.place}
                {rowData.distance}
                {rowData.people}
                {rowData.time.toLocaleDateString()}
             </li>
             <button>신청</button>
          </div>
             
             
            )):
            <li>아직 모임이 없습니다.
            </li>
        }
        
      </div>
      <ul style={{listStyleType:'none', padding:0}}>
        {renderBoard(boardRef)}
      </ul>
    </div>
  )
}

export default MainPage;
