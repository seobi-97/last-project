import React ,{ useState} from 'react';
import { connect } from 'react-redux';
import AddForm from './AddForm';
import AddItem from './AddItem';

function AddPage(props) {
  const [boards,setboards]=useState(props);
  return (
    <div>
      <AddForm/>
    </div>
  )
}
let mapStateToProps=(state)=>{
  console.log(state);
  return{
    boards:state.boards
  }
}
export default connect(mapStateToProps)(AddPage);
