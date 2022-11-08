import {
  SET_USER,
  CLEAR_USER,
  SET_PHOTO_URL,
  SET_BOARD,
  SET_CHAT,
} from "../actions/types";

const initializeUserState = {
  currentUser: null,
  isLoading: true,
  maxNo: 1,
  //게시물 데이터를 보관하는
  boards: [],
  message: [],
};

export default function (state = initializeUserState, action) {
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
    case SET_BOARD:
      return {
        ...state,
        boards: action.payload,
        isLoading: false,
      };
    case SET_CHAT:
      return {
        ...state,
        message: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}
