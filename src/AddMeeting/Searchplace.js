import React, { useState } from 'react'
import MapContainer from './MapContainer';

const Searchplace=({place1,getData1}) =>{
  const [inputText, setInputText]=useState("");
  const [place,setPlace]=useState("카카오");
  const [placedata,setplacedata]=useState("");
  
  const onChange=(e)=>{
    setInputText(e.target.value);
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    setPlace(inputText);
    setInputText("");
  };
  const getData=(placedata)=>{
    setplacedata(placedata);
    getData1(placedata);
    console.log(placedata);
  }
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
    <MapContainer searchPlace={place} placedata={placedata} getData={getData}/> 
    </>
  )
}

export default Searchplace
