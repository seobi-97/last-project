import React, { useState } from "react";
import MapContainer from "./MapContainer";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";

const Searchplace = ({ place1, getData1 }) => {
  const [inputText, setInputText] = useState("");
  const [place, setPlace] = useState("카카오");
  const [placedata, setplacedata] = useState("");

  const onChange = (e) => {
    setInputText(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText("");
  };
  const getData = (placedata) => {
    setplacedata(placedata);
    getData1(placedata);
    console.log(placedata);
  };
  return (
    <>
      <div style={{ display: "inline-block" }}>
        <Box sx={{ flexglow: 1 }} noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid xs={8}>
              <form onSubmit={handleSubmit}>
                <TextField
                  id="standard-search"
                  type="search"
                  variant="standard"
                  onChange={onChange}
                  value={inputText}
                />
              </form>
            </Grid>
            <form onSubmit={handleSubmit}>
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </form>
          </Grid>
        </Box>
      </div>
      <MapContainer
        searchPlace={place}
        placedata={placedata}
        getData={getData}
      />
    </>
  );
};

export default Searchplace;
