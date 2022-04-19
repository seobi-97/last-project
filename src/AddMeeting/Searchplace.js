import React, { useState } from 'react'
import MapContainer from './MapContainer';

function Searchplace() {
  const [inputText, setInputText]=useState("");
  const [place,setPlace]=useState("카카오");

  const onChange=(e)=>{
    setInputText(e.target.value);
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    setPlace(inputText);
    setInputText("");
  };
  return (
    <>
    
     <form className="inputForm" onSubmit={handleSubmit}>
      <input 
        placeholder="Search Place"
        onChange={onChange}
        value={inputText}
      />
      <button type="submit">검색</button>
    </form>
    <MapContainer searchPlace={place}/> 
    </>
  )
}

export default Searchplace
