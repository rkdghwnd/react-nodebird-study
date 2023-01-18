// _app.js 는 pages에 공통으로 적용되는 부분
import React from "react";
import propTypes from "prop-types";
import "antd/dist/antd.css";
// antd css를 적용하기 위한 import
import Head from "next/head";
// html의 head를 작성하기 위한 next에서 제공하는 컴포넌트
import wrapper from "../store/configureStore";

const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

NodeBird.propTypes = {
  Component: propTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);
