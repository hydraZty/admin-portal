import {
  LOAD_USER_RESOURCE_FILTER,
  LOAD_USER_GROUP_FILTER,
  LOAD_USER_ROLE_FILTER,
  LOAD_USER_LIST, LOAD_USER_PAGINATION,
} from '../constants/action-types';

const initialState = {
  resources: [],
  groups: [],
  roles: [],
  users: [],
  pagination: {
    page: 1,
    page_size: 10,
    total_count: 0,
  },
};

const userListReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USER_RESOURCE_FILTER:
      return { ...state, resources: action.payload };
    case LOAD_USER_GROUP_FILTER:
      return { ...state, groups: action.payload };
    case LOAD_USER_ROLE_FILTER:
      return { ...state, roles: action.payload };
    case LOAD_USER_LIST:
      return { ...state, users: action.payload };
    case LOAD_USER_PAGINATION:
      return { ...state, pagination: action.payload };
    default:
      return state;
  }
};

export default userListReducer;
