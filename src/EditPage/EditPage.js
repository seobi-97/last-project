import React ,{ useState} from 'react';
import { connect } from 'react-redux';
import EditForm from './EditForm';

function EditPage(props) {
  const [boards,setboards]=useState(props);
  return (
    <div>
      <EditForm/>
    </div>
  )
}
let mapStateToProps=(state)=>{
  console.log(state);
  return{
    boards:state.boards
  }
}
export default connect(mapStateToProps)(EditPage);
