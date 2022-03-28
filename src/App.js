import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import LoginPage from './LoginPage/LoginPage';
import RegisterPage from './RegisterPage/RegisterPage';
import firebase from './firebase';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/LoginPage" element={<LoginPage/>}/>
          <Route exact path="/RegisterPage" element={<RegisterPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
