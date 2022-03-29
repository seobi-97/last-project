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
  maxNo:2,
  boards:[{
    brdno:1,
    brdwriter:'SEOB',
    brdtitle:'IF you intend to live then you die',
    brddate:new Date()
  }],
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
      if(!data.brdno){
        return {maxNo:maxNo+1,boards:boards.concat({...data,brdno:maxNo, brddate:new Date()}),selectedBoard:{}};
      }return {...state,boards:boards.map(row=>data.brdno===row.brdno?{...data}:row),selectedBoard:{}};
    case BOARD_REMOVE: 
      return {
        ...state, boards: boards.filter(row => row.brdno !== action.brdno), 
        selectedBoard: {}
      }; 
    case BOARD_READ: 
      return { 
        ...state, 
        selectedBoard: boards.find(row => row.brdno === action.brdno) 
      };


  
    default:
      return state;
  }
}