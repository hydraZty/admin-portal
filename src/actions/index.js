import { forEach } from 'lodash';

import {
  LOAD_USER_DATA,
  LOAD_USER_GROUP_FILTER, LOAD_USER_LIST, LOAD_USER_PAGINATION,
  LOAD_USER_RESOURCE_FILTER,
  LOAD_USER_ROLE_FILTER,
} from '../constants/action-types';
import { arborist, fence } from '../utils/API';


export const loadUserData = () => (dispatch) => fence.get('/user').then(resp => dispatch({
  type: LOAD_USER_DATA,
  payload: resp,
}));

export const setUserResourceFilterData = (resources) => (dispatch) => dispatch({
  type: LOAD_USER_RESOURCE_FILTER,
  payload: resources,
});

export const setUserGroupFilterData = (groups) => (dispatch) => dispatch({
  type: LOAD_USER_GROUP_FILTER,
  payload: groups,
});

export const setUserRoleFilterData = (roles) => (dispatch) => dispatch({
  type: LOAD_USER_ROLE_FILTER,
  payload: roles,
});

export const loadUserList = () => async (dispatch, getState) => {
  const state = getState();
  const {
    roles,
    resources,
    groups,
  } = state.userList;
  const groupParams = [];
  const roleParams = [];
  const resourceParams = [];
  forEach(groups, group => {
    groupParams.push(group.name);
  });
  forEach(roles, role => {
    roleParams.push(role.id);
  });
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
      page,
      page_size,
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
