import {
  all,
  fork,
  call,
  put,
  take,
  delay,
  debounce,
  throttle,
  takeLatest,
  takeLeading,
  takeMaybe,
  takeEvery,
} from 'redux-saga/effects';
import axios from 'axios';
import postSaga from './post';
import userSaga from './user';

axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;

// 리덕스 사가 메소드를 쓰면 실행흐름을 단계별로 확인해보기 좋다.
// const l = logIn({type: 'LOG_IN_REQUEST', data: {id : 'zerocho@gmail.com'}})
// l.next()
// l.next()

// takeEvery : 여러번 실행되었을때 '여러번' 실행시킨다.
// takeLeading : 여러번 실행되었을때 '첫번째 것만' 실행시킨다.
// takeLatest : 기존에 진행 중이던 작업이 있다면 취소 처리하고 가장 마지막으로 실행된 작업만 수행한다.
// takeLastest에서 동작이 취소 되는 시점 :
// 프론트 -> 백엔드 요청은 남아있음, '백엔드 -> 프론트 "응답"'을 취소

// throttle : 실행주기를 제어(여러번 실행해도 ㅇㅇ초에 한번만 실행되게)
// ex) yield throttle("ADD_POST_REQUEST", addPost, 10000);

export default function* rootSaga() {
  // function* : 제너레이터 함수,
  // yield : 제너레이터 함수안에서 사용가능한 문법, 현재 줄까지만 실행하고 실행을 중단시킴
  // const g = 제너레이터(); g.next(); 로 yield 넘어가며 실행 가능
  // 제너레이터 : 객체의 한 종류,

  // all : 인자로 들어간 배열의 요소를 전부 실행시킴
  // fork : 인자로 들어간 콜백함수를 실행시킴 (fork는 비동기적 실행)
  // 콜백함수(watch 함수들) 실행이 끝나는것과 관계없이 다음 줄 실행
  yield all([fork(postSaga), fork(userSaga)]);
}
