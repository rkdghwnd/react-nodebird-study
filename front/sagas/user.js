import { fork, takeLatest, delay, put, all, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  CHANGE_NICKNAME_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  FOLLOW_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  UNFOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
} from '../reducers/user';

function loadMyInfoAPI() {
  return axios.get('/user');
}

function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

// 여기는 * 붙이지 말기
function logInAPI(data) {
  return axios.post('/user/login', data, { withCredentials: true });
}

// put : dispatch 와 같은 동작
function* logIn(action) {
  try {
    // call : 첫번째 인자로 들어간 콜백함수를 실행시킴(call은 동기적 실행)
    // 다음 인자들은 첫번재 콜백함수의 인자
    // call이 호출되면 logInAPI가 return 할때까지 기다렸다가 return 값을 result에 넣어준다.
    // 그 이후에 다음 줄 실행

    const result = yield call(logInAPI, action.data);
    // delay : ㅇㅇ초 지연시키기

    console.log(result);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

// 여기는 * 붙이지 말기
function logOutAPI() {
  return axios.post('/user/logout');
}

function* logOut() {
  try {
    // call : 인자로 들어간 콜백함수를 실행시킴(call은 동기적 실행)
    // call이 호출되면 logInAPI가 return 할때까지 기다렸다가 return 값을 result에 넣어준다.
    // 그 이후에 다음 줄 실행

    // const result = yield call(logOutAPI);
    // delay : ㅇㅇ초 지연시키기
    // yield delay(1000);
    // throw new Error('') 여기에 적으면 아래줄 실행안하고 catch 로 넘어간다
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

// 여기는 * 붙이지 말기
function signUpAPI(data) {
  return axios.post('/user', data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`);
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function changeNicknameAPI(data) {
  return axios.patch('/user/nickname', { nickname: data });
}

function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowingsAPI() {
  return axios.get('/user/followings');
}

function* loadFollowings() {
  try {
    const result = yield call(loadFollowingsAPI);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowersAPI() {
  return axios.get('/user/followers');
}

function* loadFollowers() {
  try {
    const result = yield call(loadFollowersAPI);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err.response.data,
    });
  }
}

function removeFollowerAPI(data) {
  return axios.delete(`/user/follower/${data}`);
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}
// take : [인자] 액션이 실행될때까지 기다리겠다.
// 첫번째 인자 액션 실행 -> 두번째 인자 콜백함수 호출
// 마치 이벤트 리스너처럼 사용을 하게 됨(watch 함수들을 핸들러처럼 정의)
function* watchLogIn() {
  // yield take로만 작성하면 한번만 실행되기 때문에
  // 여러번 로그인을 할 수 없다.
  // 여러번 실행을 하려면 while(true){}로 감싸거나
  // takeEvery를 사용한다.

  yield takeLatest(LOG_IN_REQUEST, logIn);
}
function* watchLogOut() {
  // takeLatest : 기존에 진행 중이던 작업이 있다면 취소 처리하고 가장 마지막으로 실행된 작업만 수행한다.
  // takeLastest에서 동작이 취소 되는 시점 :
  // 프론트 -> 백엔드 요청은 남아있음, '백엔드 -> 프론트 "응답"'을 취소

  yield takeLatest(LOG_OUT_REQUEST, logOut);
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

export default function* userSaga() {
  // function* : 제너레이터 함수,
  // yield : 제너레이터 함수안에서 사용가능한 문법, 현재 줄까지만 실행하고 실행을 중단시킴
  // const g = 제너레이터(); g.next(); 로 yield 넘어가며 실행 가능
  // 제너레이터 : 객체의 한 종류,

  // all : 인자로 들어간 배열의 요소를 전부 실행시킴
  // fork : 인자로 들어간 콜백함수를 실행시킴 (fork는 비동기적 실행)
  // 콜백함수(watch 함수들) 실행이 끝나는것과 관계없이 다음 줄 실행
  yield all([
    fork(watchLoadMyInfo),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchChangeNickname),
    fork(watchLoadFollowings),
    fork(watchLoadFollowers),
    fork(watchRemoveFollower),
  ]);
}
