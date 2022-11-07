import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Map from "./Map";

const Place = () => {
  const { place } = useParams();
  return (
    <>
      <div>
        <div className="checkmap">
          <h3>위치 확인</h3>
        </div>
        <div className="checkmap">
          <Map searchPlace={place} />
        </div>
      </div>
    </>
  );
};

export default Place;
