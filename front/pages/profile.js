import React, { useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import FollowList from '../components/FollowList';
import NinknameEditForm from '../components/NinknameEditForm';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
} from '../reducers/user';
const profile = () => {
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);

  // 내 정보가 없으면 리다이렉트
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/'); // next.js 문법, 페이지 이동
    }
  }, [me && me.id]);

  if (!me) {
    return null;
  }
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NinknameEditForm />
        <FollowList header="팔로잉" data={me.Followings} />
        <FollowList header="팔로워" data={me.Followers} />
      </AppLayout>
    </>
  );
};

export default profile;
