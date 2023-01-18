import { useState, useCallback } from "react";

export default (initialValue = null) => {
  // 반복되는 로직
  // (예를 들어 id, password 상태 변화시키는 로직이 겹친다.)은
  // custom hook으로 만들면 좋다.

  const [value, setValue] = useState("");

  // 컴포넌트에 props로 넘겨주는 함수는 useCallback 이용해서 최적화 하자
  const handler = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, []);

  return [value, handler, setValue];
};
