import React from 'react';
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link } from 'react-router-dom';

import {useSelector} from "react-redux";

function MainPage() {
  let boards=useSelector(state=>state.user.boards);
  const maxNo=useSelector(state=>state.user.maxNo);

  if(boards.length>1&&boards[0].no==0){
    boards.shift();
  }
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
             <button>sd</button>
          </div>
             
             
            )):
            <li>아직 모임이 없습니다.
            </li>
        }
        
      </div>
    </div>
  )
}

export default MainPage;
