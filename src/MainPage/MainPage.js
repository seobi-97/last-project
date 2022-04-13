import React from 'react';
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link } from 'react-router-dom';

import {useSelector} from "react-redux";

function MainPage() {
  const boards=useSelector(state=>state.user.boards);
  const maxNo=useSelector(state=>state.user.maxNo);
  console.log(useSelector(state=>state));

  const handleLogout=()=>{
    const auth=getAuth();
    signOut(auth).then(()=>{

    }).catch((error)=>{

    })
  }
  return (
    <div>
      <div>
        MainPage
        <button onClick={handleLogout}>로그아웃</button>
        <Link style={{color:'gray', textDecoration:'none'}} to="/AddPage">생성하기</Link>
      </div>
      <div>
        <ul>
        {maxNo!==1?boards&&boards.map((rowData)=>(
        
         
             <li key={rowData.no}>
                {rowData.no}
                {rowData.place}
                {rowData.distance}
                {rowData.people}
             </li>
                
            )):
            <li>아직 모임이 없습니다.
            </li>
            
           
        }
        </ul>
      </div>
    </div>
  )
}

export default MainPage;
