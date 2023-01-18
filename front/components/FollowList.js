import React, { useCallback } from 'react';
import { List, Button, Card } from 'antd';
import propTypes from 'prop-types';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';

const FollowList = ({ header, data }) => {
  const dispatch = useDispatch();
  const onCancel = useCallback(
    id => () => {
      if (header === '팔로잉') {
        dispatch({
          type: UNFOLLOW_REQUEST,
          data: id,
        });
      } else {
        dispatch({
          type: REMOVE_FOLLOWER_REQUEST,
          data: id,
        });
      }
    },
    [],
  );
  return (
    <List
      style={{ marginBottom: 20 }}
      grid={{ gutter: 4, column: 3, xs: 2, md: 3 }}
      header={<div>{header}</div>}
      loadMore={
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <Button>더 보기</Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={item => (
        <List.Item
          style={{
            marginTop: '20px',
          }}
        >
          <Card
            actions={[<StopOutlined key="stop" onClick={onCancel(item.id)} />]}
          >
            <Card.Meta
              description={item.nickname}
              style={{ textAlign: 'center' }}
            />
          </Card>
        </List.Item>
      )}
    ></List>
  );
};

FollowList.propTypes = {
  header: propTypes.string.isRequired,
  data: propTypes.array.isRequired,
};

export default FollowList;
