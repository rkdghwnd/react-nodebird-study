import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Input, Form, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPost,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
  ADD_POST_REQUEST,
} from '../reducers/post';
import useInput from '../hooks/useInput';

const PostForm = () => {
  const dispatch = useDispatch();
  const { addPostDone, addPostLoading } = useSelector(state => state.post);
  const imageInput = useRef();
  const { imagePaths } = useSelector(state => state.post);
  const [text, onChangeText, setText] = useInput('');

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]); // 글 작성이 완료되었을때(ADD_POST_SUCCESS) 본문텍스트 초기화

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    imagePaths.forEach(p => {
      formData.append('image', p); // req.body에 들어감(이미지나 파일 아닌 텍스트(이미지경로))
    });
    formData.append('content', text); // req.body에 들어감
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback(e => {
    console.log('images', e.currentTarget.value);
    const imageFormData = new FormData(); // FormData 형식 객체 생성
    [].forEach.call(e.currentTarget.files, f => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback(
    index => () => {
      dispatch({
        type: REMOVE_IMAGE,
        data: index,
      });
    },
    [],
  );
  return (
    <Form
      style={{ margin: '10px 0 20px' }}
      encType="multipart/form-data" // 이미지 데이터 형식
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요:?"
      ></Input.TextArea>
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button
          loading={addPostLoading}
          type="primary"
          style={{ float: 'right' }}
          htmlType="submit"
        >
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img
              src={`http://localhost:3065/${v}`}
              style={{ width: '200px' }}
              alt={v}
            />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
