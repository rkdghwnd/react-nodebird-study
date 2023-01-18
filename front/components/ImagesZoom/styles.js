import styled, { createGlobalStyle } from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

export const Overlay = styled.div`
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const Header = styled.header`
  height: 44px;
  background: white;
  position: relative;
  padding:0
  text-align: center;

  & h1 {
    margin: 0;
    font-size: 17px;
    color: #333;
    line-height: 44px;
  }
`;

export const CloseBtn = styled(CloseOutlined)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px;
  line-height: 14px;
  cursor: pointer;
`;

export const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  background: #090909;
`;

export const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-height: 750px;
  }
`;

export const Indicator = styled.div`
  text-align: center;

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;

// createGlobalStyle : 전역 스타일 설정
// 슬릭 이미지가 제대로 뜨지 않는 문제 해결
export const Global = createGlobalStyle`
  .slick-slide {
    display: inline-block;
  }

  /* antd 최신버전에서 백드롭이 갖혀있는 현상
  -> 개발자 도구 보면 부모 요소가 transform 속성 적용 되있음
  -> 브라우저에서 부모가 transform 적용되면 자식 position이 적용 안되는 버그
  -> transform을 비활성화 시켜야 한다.
  .ant-card-cover {
    transform: none !important;
  } */
`;
