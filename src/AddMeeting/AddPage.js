import React, { useState } from "react";
import { connect } from "react-redux";
import AddForm from "./AddForm";

function AddPage(props) {
  const [boards, setboards] = useState(props);
  return (
    <div>
      <AddForm />
    </div>
  );
}
let mapStateToProps = (state) => {
  return {
    boards: state.boards,
  };
};
export default connect(mapStateToProps)(AddPage);
