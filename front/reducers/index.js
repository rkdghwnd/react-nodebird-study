import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import user from './user';
import post from './post';

// 두개의 리듀서 combineReducers 로 합치기
// ssr을 위해 index 부분 만들기
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      // withRedux(NodeBird) created new store with
      // {initialState: undefined, initialStateFromGSPorGSSR: undefined}
      // 해당오류 해결하기 위한 HYDRATE 로직?
      // 근데 안사라지는중...(프론트까지만 개발)
      case HYDRATE:
        // console.log("HYDRATE", action);
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
