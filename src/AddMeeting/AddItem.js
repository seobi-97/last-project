import React from 'react'
import { useSelector } from 'react-redux';

function AddItem() {
  const {board}=useSelector(state=>state.user_reducer)
  const {maxNo}=useSelector(state=>state.user_reducer)
  return (
    <div>
      <table>
        <tr>
          <td>No.</td>
          <td>Time</td>
          <td>Place</td>
          <td>Distance</td>
          <td>People</td>
        </tr>
        {maxNo!==0?
          board.map(row=>(
            row.no!==""&&
            <tr>
              <td>{row.no}</td>
              <td>{row.time}</td>
              <td>{row.place}</td>
              <td>{row.distance}</td>
              <td>{row.people}</td>
            </tr>
          )):
          <tr>
            <td>없음</td>
          </tr>
        }
      </table>
    </div>
  )
}

export default AddItem

