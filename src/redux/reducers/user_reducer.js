import { SET_USER, CLEAR_USER, SET_PHOTO_URL } from "../actions/types";

const initializeUserState = {
  currentUser: null,
  isLoading: true,
  maxNo: 1,
  //게시물 데이터를 보관하는
  boards: [
    {
      id: "",
      no: 0,
      time: "",
      place: "",
      distance: "",
      people: "",
      participant: "",
      brddate: new Date(),
    },
  ],
  //데이터 수정을 위해 현재 선택한 글 정보를 가지는
  selectedBoard: {},
};

export default function (state = initializeUserState, action) {
  let boards = state.boards;

  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };
    case CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        isLoading: false,
      };
    case SET_PHOTO_URL:
      return {
        ...state,
        currentUser: { ...state.currentUser, photoURL: action.payload },
        isLoading: false,
      };
    default:
      return state;
  }
}
