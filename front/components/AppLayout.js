import React, { useState, useCallback, useMemo } from 'react';
import propTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
// npm i react-redux
import { useSelector } from 'react-redux';

import styled from 'styled-components';

import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector(state => state.user);
  const menuItems = [
    {
      key: 'nodebird',
      icon: (
        <Link href="/">
          {/* Link에 style 입히기 위해서는 Link 안에 a태그 넣고 class를 추가해야 한다. */}
          <a>노드버드</a>
        </Link>
      ),
    },
    {
      key: 'profile',
      icon: (
        <Link href="/profile">
          <a>프로필</a>
        </Link>
      ),
    },
    {
      key: 'search',
      icon: <SearchInput enterButton />,
    },
    {
      key: 'signup',
      icon: (
        <Link href="/signup">
          <a>회원가입</a>
        </Link>
      ),
    },
  ];

  return (
    <div>
      {/* <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu> */}
      <Menu items={menuItems} mode="horizontal" />
      {/* antd 는 Row, Col을 이용해서 반응형 Grid 작성가능 */}
      {/* Grid는 보통 전체 레이아웃 잡을때 주로 활용(물론 개별 레이아웃에 활용 할 수도 있음, 편한대로) */}
      <Row gutter={8}>
        {/* gutter : 간격 (column 사이에 간격을 주는 속성) */}
        {/* xs : 모바일, sm: 태블릿, md: 작은 데스크탑 */}
        {/* 24가 전체 칸, 6은 24칸 중 6칸(6 / 24 %) */}
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          {/* target="_blank" 적을때는 rel="noreferrer noopener" 도 같이 적기
          target="_blank" 만 적으면 보안위협이 있어서 같이 붙어야 한다. 
          noreferrer : 어느 페이지로 부터 넘어왔는지에 대한 정보(레퍼런스)를 제공하지 않겠다.
          noopener : 창을 열어본사람(사용)에 대한 정보를 제공하지 않겠다.  */}
          <a
            href="https://www.zerocho.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by Zerocho
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: propTypes.node.isRequired,
};

export default AppLayout;
