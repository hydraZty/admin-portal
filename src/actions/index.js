import { forEach } from 'lodash';

import {
  LOAD_USER_DATA,
  LOAD_USER_GROUP_FILTER, LOAD_USER_LIST, LOAD_USER_PAGINATION,
  LOAD_USER_RESOURCE_FILTER,
  LOAD_NAMESPACE_DATA,
  SET_SELECTED_NAMESPACE,
  LOAD_RESOURCE_DATA,
  SET_SELECTED_ROLE,
  SET_KEYWORD,
  SET_USER_LIST_LOADING,
} from '../constants/action-types';
import { arborist, fence } from '../utils/API';


export const loadUserData = () => (dispatch) => fence.get('/user').then(resp => dispatch({
  type: LOAD_USER_DATA,
  payload: resp,
}));

export const loadNamespaceData = () => (dispatch) => arborist.get('/resource/namespace').then(resp => dispatch({
  type: LOAD_NAMESPACE_DATA,
  payload: resp.resources,
}));

export const setSelectedNamespace = (namespace) => async (dispatch) => dispatch({
  type: SET_SELECTED_NAMESPACE,
  payload: namespace,
});

export const setSelectedRole = (role) => async (dispatch) => dispatch({
  type: SET_SELECTED_ROLE,
  payload: role,
});

export const setResourceTreeData = (data) => (dispatch) => dispatch({
  type: LOAD_RESOURCE_DATA,
  payload: data,
});

export const setUserResourceFilterData = (resources) => (dispatch) => dispatch({
  type: LOAD_USER_RESOURCE_FILTER,
  payload: resources,
});

export const setUserGroupFilterData = (groups) => (dispatch) => dispatch({
  type: LOAD_USER_GROUP_FILTER,
  payload: groups,
});

export const loadUserList = (resetPagination = true) => async (dispatch, getState) => {
  const state = getState();
  dispatch({
    type: SET_USER_LIST_LOADING,
    payload: true,
  });
  const {
    selectedRole,
    resources,
    groups,
    keyword,
  } = state.userList;
  const groupParams = [];
  const roleParams = [];
  const resourceParams = [];
  forEach(groups, group => {
    groupParams.push(group.name);
  });
  if (selectedRole) {
    roleParams.push(selectedRole);
  }
  forEach(resources, resource => {
    resourceParams.push(resource);
  });
  // eslint-disable-next-line camelcase
  const { page, page_size } = state.userList.pagination;
  // eslint-disable-next-line camelcase
  const resp = await arborist.get('/user', {
    params: {
      roles: roleParams,
      resources: resourceParams,
      groups: groupParams,
      page: resetPagination ? 1 : page,
      page_size,
      keyword: keyword || null,
    },
  });
  dispatch({
    type: LOAD_USER_LIST,
    payload: resp.users,
  });
  dispatch({
    type: LOAD_USER_PAGINATION,
    payload: resp.pagination,
  });
  dispatch({
    type: SET_USER_LIST_LOADING,
    payload: false,
  });
};

export const setPagination = (page, pageSize, total = null) => (dispatch, getState) => {
  dispatch({
    type: LOAD_USER_PAGINATION,
    payload: {
      page,
      page_size: pageSize,
      total: total || getState().userList.pagination.total_count,
    },
  });
};

export const setKeyword = (keyword) => (dispatch) => dispatch({
  type: SET_KEYWORD,
  payload: keyword,
});
