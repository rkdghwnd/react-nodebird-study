import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
// npm init (package.json 파일 만들기)
// npm i next@9 (next 9버전 설치)
// react는 설치하지 않아도 next를 설치하면 지원이 된다.
// (만약에 안되면 npm i react react-dom)
// npm i prop-types (prop-types 설치)

// npm i antd styled-components @ant-design/icons
// 이미지 파일이 용량을 많이 잡아먹기 때문에(성능문제) icons는 따로 설치해서 쓰는게 좋음

// 라우팅은 pages 폴더를 만들어서 그 안에 넣어야 라우팅 됨
// ex) localhost:3000/, localhost:3000/profile, localhost:3000/signup

// 초기 세팅
// npm i eslint -D
// npm i eslint-plugin-import -D
// npm i eslint-plugin-react -D
// npm i eslint-plugin-react-hooks -D

// 엄격한 세팅(eslint 점검)
// npm i -D babel-eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-react-hooks
// +
// npm i -D eslint-plugin-jsx-a11y
// 웹 접근성 검사 플러그인

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
    useSelector(state => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST, // 로그인 유지
    });
    dispatch({
      type: LOAD_POSTS_REQUEST, // 초기 페이지 로드
    });
  }, []);

  useEffect(() => {
    function onScroll() {
      // console.log(
      //   window.scrollY, // Y축 스크롤 위치
      //   document.documentElement.clientHeight, // 뷰포트 높이
      //   document.documentElement.scrollHeight // 맨위 스크롤 ~ 맨아래 스크롤 총 길이
      // );
      // hasMorePosts 를 이용해 일정개수 게시글까지만 불러오도록 함
      // loadPostsLoading 으로 로딩중이 아닐때만 request가 적용되도록 함
      if (
        hasMorePosts &&
        !loadPostsLoading &&
        window.scrollY + document.documentElement.clientHeight >
          document.documentElement.scrollHeight - 300
      ) {
        const lastId = mainPosts[mainPosts.length - 1]?.id;
        dispatch({
          type: LOAD_POSTS_REQUEST,
          lastId,
        });
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    }; // 해제 안하면 메모리에 계속 쌓임(useEffect 클린업함수 참고)
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map(post => (
        <PostCard post={post} key={post.id} />
      ))}
    </AppLayout>
  );
};

export default Home;
