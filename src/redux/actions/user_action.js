import {
  SET_USER,
  CLEAR_USER,
  SET_PHOTO_URL,
  BOARD_SAVE,
  BOARD_REMOVE,
  BOARD_READ,
  BOARD_LIST,
} from './types';

export function setUser(user) {
  return {
      type: SET_USER,
      payload: user
  }
}

export function clearUser() {
  return {
      type: CLEAR_USER
  }
}


export function setPhotoURL(photoURL) {
  return {
      type: SET_PHOTO_URL,
      payload: photoURL
  }
}

export function boardSave(data){
  return{
    type: BOARD_SAVE,
    data
  }
}

export function boardRemove(brdno){
  return{
    type: BOARD_REMOVE,
    brdno: brdno
  }
}

export function boardRead(brdno){
  return{
    type:BOARD_READ,
    brdno:brdno
  }
}