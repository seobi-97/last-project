import {
  SET_USER,
  CLEAR_USER,
  SET_PHOTO_URL,
  BOARD_SAVE,
  BOARD_REMOVE,
  BOARD_READ,
  BOARD_LIST
}from '../actions/types';

const initializeUserState = {
  currentUser:null,
  isLoading: true,
  maxNo:1, //최대 글 번호
  //게시물 데이터를 보관하는
  boards:[{
    id:'',
    no:0,
    time:'',
    place:'',
    distance:'',
    people:'',
    brddate:new Date()
  }],
  //데이터 수정을 위해 현재 선택한 글 정보를 가지는
  selectedBoard:{}
}

export default function (state = initializeUserState, action){
  let boards=state.boards;

  switch(action.type){
    case SET_USER:
      return{
        ...state,
        currentUser:action.payload,
        isLoading:false
      }
    case CLEAR_USER:
      return{
        ...state,
        currentUser:null,
        isLoading:false,
      }
    case SET_PHOTO_URL:
      return{
        ...state,
        currentUser:{...state.currentUser,photoURL:action.payload},
        isLoading:false
      }
    case BOARD_SAVE:
      let data=action.data;
      let maxNo=state.maxNo;
      //brdno값이 없으면 신규이므로 기존 게시물 데이터에 추가해줘야한다.
      if(!data.no){
        return {maxNo:maxNo+1,boards:boards.concat({...data,no:maxNo, brddate:new Date()}),selectedBoard:{}};
      }return {...state,boards:boards.map(row=>data.no===row.no?{...data}:row),selectedBoard:{}};
    case BOARD_REMOVE: 
      return {
        //삭제부분은 글 번호에 해당하는 행을 찾아서 지우는 방식이 아니고, 삭제할 게시물이 아닌것들만 모아서 다시 생성하는식
        ...state, boards: boards.filter(row => row.no !== action.no), 
        selectedBoard: {}
      }; 
    case BOARD_READ: 
      return { 
        ...state, 
        selectedBoard: boards.find(row => row.no === action.no) 
      };


  
    default:
      return state;
  }
}