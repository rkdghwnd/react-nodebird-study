import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

// 해시태그 기능
const PostCardContent = ({ postData }) => {
  // 첫 번째 게시글 #해시태그 #익스프레스
  // 정규표현식으로 나누고
  // 해시태그는 링크 걸어 리턴
  // 아닌것은 그냥 리턴
  return (
    <div>
      {postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if (v.match(/(#[^\s#]+)/)) {
          return (
            <Link href={`/hashtag/${v.slice(1)}`} key={i}>
              <a>{v}</a>
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
