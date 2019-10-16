import axios from 'axios';

export const arborist = axios.create({
  baseURL: '/arborist',
  responseType: 'json',
});

export const fence = axios.create({
  baseURL: '/user',
  responseType: 'json',
});

arborist.interceptors.response.use(response => response.data, (error) => Promise.reject(error));
fence.interceptors.response.use(response => response.data, (error) => Promise.reject(error));
