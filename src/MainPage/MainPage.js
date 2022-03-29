import React from 'react'
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link } from 'react-router-dom';

function MainPage() {
  const handleLogout=()=>{
    const auth=getAuth();
    signOut(auth).then(()=>{

    }).catch((error)=>{

    })
  }
  return (
    <div>
      MainPage
      <button onClick={handleLogout}>로그아웃</button>
      <Link style={{color:'gray', textDecoration:'none'}} to="/AddPage">생성하기</Link>
    </div>
  )
}

export default MainPage;
