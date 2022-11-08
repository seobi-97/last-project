import {
  SET_USER,
  CLEAR_USER,
  SET_PHOTO_URL,
  SET_BOARD,
  SET_CHAT,
} from "./types";

export function setUser(user) {
  return {
    type: SET_USER,
    payload: user,
  };
}

export function clearUser() {
  return {
    type: CLEAR_USER,
  };
}

export function setPhotoURL(photoURL) {
  return {
    type: SET_PHOTO_URL,
    payload: photoURL,
  };
}
export function setBoard(boards) {
  return {
    type: SET_BOARD,
    payload: boards,
  };
}
export function setChat(message) {
  return {
    type: SET_CHAT,
    payload: message,
  };
}
