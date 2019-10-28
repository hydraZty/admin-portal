import axios from 'axios';
import { Modal } from 'antd';
import { get } from 'lodash';
import store from '../store/index';
// eslint-disable-next-line import/no-cycle
import { emptyStore } from '../actions';

export const arborist = axios.create({
  baseURL: '/arborist',
  responseType: 'json',
});

export const fence = axios.create({
  baseURL: '/user',
  responseType: 'json',
});

arborist.interceptors.response.use(
  response => response.data,
  (error) => {
    const res = error.response;
    const message = get(res, 'data.error.message');
    if (!res) {
      Modal.error({
        title: 'Unknown Error',
        content: message || error.message,
      });
    }
    const { status, statusText } = res;
    let title;
    let content;

    switch (status) {
      case 400:
        title = '400 Bad Request';
        content = message;
        break;
      case 401:
        store.dispatch(emptyStore());
        title = '401 Unauthorized';
        content = 'Please Login';
        break;
      case 500:
        title = '500 Internal Server Error';
        content = 'A server error occurred. Please contact the administrator.';
        break;
      default:
        title = `${status} ${statusText}`;
        content = message;
    }

    Modal.error({ title, content });

    return Promise.reject(error);
  },
);
fence.interceptors.response.use(response => response.data, (error) => Promise.reject(error));
