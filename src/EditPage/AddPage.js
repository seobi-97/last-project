import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import AddForm from "./AddForm";

function AddPage(props) {
  const [boards, setboards] = useState(props);
  const { no } = useParams();
  console.log(no);
  //sessionStorge
  let sessionStorage = window.sessionStorage;
  const result = JSON.parse(sessionStorage.getItem("board"));
  return (
    <div>
      <AddForm result={result[no]} />
    </div>
  );
}
let mapStateToProps = (state) => {
  console.log(state);
  return {
    boards: state.boards,
  };
};
export default connect(mapStateToProps)(AddPage);
