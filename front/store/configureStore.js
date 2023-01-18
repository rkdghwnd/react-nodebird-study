// npm i next-redux-wrapper redux
import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import reducer from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
// npm i redux-saga
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

const loggerMiddleware =
  ({ dispatch, getState }) =>
  next =>
  action => {
    console.log(action);
    return next(action);
  };

const configureStore = () => {
  // createSagaMiddleware : 사가 미들웨어 생성
  const sagaMiddleware = createSagaMiddleware();
  // enhancer는 리덕스에 적용할 미들웨어
  // compose : 미들웨어를 적용할 메소드, applyMiddleware(...arr) 인자로 미들웨어 삽입
  // composeWithDevTools : 미들웨어 적용 + redux Devtools 활성화
  // applyMiddleware : 미들웨어를 적용할 메소드

  const middlewares = [sagaMiddleware, loggerMiddleware];
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));

  const store = createStore(reducer, enhancer);
  // store.sagaTask : 사가 미들웨어 세팅
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;

// 리덕스 사용하는 경우
// 1. 비동기처리(axios. fetch 등)
// redux를 안쓰면 비동기 요청같은 것들을 useEffect 안에 넣어서 처리하게 되는데
// useEffect는 일반적으로 컴포넌트 안에서 작성하고 될것이고(밖에다 작성하면 리덕스 형태와 비슷해짐)
// 컴포넌트 마다 각각 axios 요청을 작성하면서 코드의 중복이 일어날 것이다.
// 또한, 컴포넌트는 화면구성에 집중하는것이 좀더 깔끔하게 코드를 작성하는 방법이기 때문에
// 비동기 요청은 리덕스를 사용하는 것이 좋다.

// 2. 상태 끌어올리기
// 상태 끌어올리기는 실행흐름을 파악하기 어렵게 한다. 전역저장소에서 관리하는 것이 효과적
// (다만 리덕스는 코드량이 많아지기 때문에 간단한 상태 끌어올리기는 그냥 구현하는것이 좋을수도 있음)
