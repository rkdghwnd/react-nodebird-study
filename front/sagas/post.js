import { fork, takeLatest, delay, put, all, call } from 'redux-saga/effects';
import axios from 'axios';
// import shortId from 'shortid';
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  generateDummyPost,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LOAD_POSTS_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  RETWEET_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

// 여기는 * 붙이지 말기
function addPostAPI(data) {
  return axios.post('/post', data); // formData는 감싸면 안되고 그대로 보내야함
}

function* addPost(action) {
  try {
    // call : 인자로 들어간 콜백함수를 실행시킴(call은 동기적 실행)
    // call이 호출되면 logInAPI가 return 할때까지 기다렸다가 return 값을 result에 넣어준다.
    // 그 이후에 다음 줄 실행

    // const result = yield call(addPostAPI, action.data);
    // delay : ㅇㅇ초 지연시키기
    // yield delay(1000);
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

// 여기는 * 붙이지 말기
function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data); // POST /post/1/comment
}

function* addComment(action) {
  try {
    // call : 인자로 들어간 콜백함수를 실행시킴(call은 동기적 실행)
    // call이 호출되면 logInAPI가 return 할때까지 기다렸다가 return 값을 result에 넣어준다.
    // 그 이후에 다음 줄 실행

    // delay : ㅇㅇ초 지연시키기
    // yield delay(1000);
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

// 여기는 * 붙이지 말기
function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

// 여기는 * 붙이지 말기
function loadPostsAPI(lastId) {
  // get 메소드는 데이터를 못넣기 때문에(url params도 마찬가지)
  // 데이터를 전달하려면 쿼리스트링으로 전달해야 한다.[? 또는 &]
  // ex) `/posts?lastId=${lastId}&limit=10&offset=10`
  return axios.get(`/posts?lastId=${lastId || 0}`);
  // get메소드는 데이터 캐싱이 된다?(get만의 이점?)
}

function* loadPosts(action) {
  try {
    // yield delay(1000);
    const result = yield call(loadPostsAPI, action.lastId);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function uploadImagesAPI(data) {
  return axios.post('/post/images', data); // FormData는 그대로 들어가야함, 객체로 감싸면 json으로 변환됨
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`); // FormData는 그대로 들어가야함, 객체로 감싸면 json으로 변환됨
}

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RETWEET_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchAddPost() {
  // throttle : 여러번 요청이 들어왔을때 ㅇㅇ초에 하나씩 실행
  // ex) throttle(5000,콜백함수) : 3개 요청 들어오면 3개를 0초 5초 10초에 수행하는 식
  // takeLatest : 기존에 진행 중이던 작업이 있다면 취소 처리하고 가장 마지막으로 실행된 작업만 수행한다.
  // takeLastest에서 동작이 취소 되는 시점 :
  // 프론트 -> 백엔드 요청은 남아있음, '백엔드 -> 프론트 "응답"'을 취소
  yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}
function* watchLoadPost() {
  yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
  // 인피니트 스크롤링시 이벤트가 너무 많이 발생함
  // -> request도 불필요하게 많이 발생
  // -> 최적화 필요

  // 1.throttle 이용하는 경우
  // 시간차만 생길 뿐 request가 들어온만큼 success를 실행시킨다. -> 잘못된 동작
  // 2.takeLatest로 처리하는 경우
  // success는 하나지만 request는 여러개이다. -> 유효한 동작이지만 request를 막진 못했다
  // 3.loadPostsLoading 을 이용하는 방법
  // request dispatch 자체를 로딩중이 아닐때만 실행시킨다 -> 여러번 request 안옴(최적화)
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}
export default function* postSaga() {
  // function* : 제너레이터 함수,
  // yield : 제너레이터 함수안에서 사용가능한 문법, 현재 줄까지만 실행하고 실행을 중단시킴
  // const g = 제너레이터(); g.next(); 로 yield 넘어가며 실행 가능
  // 제너레이터 : 객체의 한 종류,

  // all : 인자로 들어간 배열의 요소를 전부 실행시킴
  // fork : 인자로 들어간 콜백함수를 실행시킴 (fork는 비동기적 실행)
  // 콜백함수(watch 함수들) 실행이 끝나는것과 관계없이 다음 줄 실행
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchRemovePost),
    fork(watchLoadPost),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchUploadImages),
    fork(watchRetweet),
  ]);
}
