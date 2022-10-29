import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import MainPage from './MainPage/MainPage';
import LoginPage from './LoginPage/LoginPage';
import RegisterPage from './RegisterPage/RegisterPage';
import AddPage from './AddMeeting/AddPage';
import EditPage from './EditPage/EditPage';
import firebase from './firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from "./redux/actions/user_action";
import MyPage from './MyPage/MyPage';

function App(props) {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const isLoading = useSelector((state)=>state.user.isLoading);
  
  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user)=>{
      if(user){
        navigate("/");
        dispatch(setUser(user));
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      }else{
        navigate("/LoginPage");
        dispatch(clearUser());
      }
    })
  },[])
  if (isLoading) {
    return <div>...loading</div>;
  } else {
      return (
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/LoginPage" element={<LoginPage/>}/>
          <Route path="/RegisterPage" element={<RegisterPage/>}/>
          <Route path="/AddPage" element={<AddPage/>}/>
          <Route path="/EditPage" element={<EditPage/>}/>
          <Route path="/MyPage" element={<MyPage/>}/>
        </Routes>
      );
    }
}

export default App;
