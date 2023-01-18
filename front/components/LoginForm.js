import React, { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction } from '../reducers/user';

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector(state => state.user);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const onSubmitForm = useCallback(() => {
    // 원래 DOM 같은 경우는 e.preventDefault 로 submit 이벤트를 막아야 하지만
    // antd 는 Form 컴포넌트 자체가 submit 이벤트에 e.preventDefault가 적용돼 있다
    dispatch(loginRequestAction({ email, password }));
    console.log(email, password);
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        {/* html에서는 label 속성에 for을 이용해 연결하지만 리액트에서는 htmlFor를 사용한다.
        왜냐하면 for로 연결하는 것은 DOM에 직접 연결하는 것이기 때문에 지양해야함(리액트를 비효율적으로 작동하게함) */}
        <br />
        <Input
          name="user-email"
          value={email}
          type="email"
          onChange={onChangeEmail}
          required
        />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
