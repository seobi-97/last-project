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

export function boardlist(){
  return{
    type:BOARD_LIST,
  }
}

/*export function firebase_board_list(){
  return(dispatch)=>{
    return firestore.collection('boards').orderBy("brddate","desc").get()
      .then((snapshot)=>{
        var rows=[];
        snapshot.forEach((doc)=>{
          var childData=doc.data();
          childData.brddate=dateFormat(childData.brddate,"yyyy-mm-dd");
          rows.push(childData);
        })
        dispatch(boardlist(rows));
      })
  }
}
export function firebase_board_remove(brdno={}){
  return(dispatch)=>{
    console.log(brdno);
    return firestore.collection('boards'.doc(brdno).delete().then(()=>{
      dispatch(boardRemove(brdno));
    }))
  }
}

export function firebase_board_save(data={}){
  return(dispatch)=>{
    if(!data.brdno){
      var doc = firestore.collection('boards').doc();
      data.brdno=doc.id;
      data.brddate=Date.now();
      return doc.set(data).then(()=>{
        data.brddate=dateFormat(data.brddate,"yyyy-mm-dd");
        dispatch(boardSave(data));
      })
    }else{
      return firestore.collection('boards').doc(data.brdno).update(data).then(()=>{
        dispatch(boardSave(data));
      })
    }
  }
}*/