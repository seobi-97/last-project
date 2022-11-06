import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Map from "./Map";

const Place = () => {
  const { place } = useParams();
  return (
    <>
      <Map searchPlace={place} />
    </>
  );
};

export default Place;
