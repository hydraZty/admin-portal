import {
  LOAD_USER_RESOURCE_FILTER,
  LOAD_USER_GROUP_FILTER,
  LOAD_USER_LIST,
  LOAD_USER_PAGINATION,
  LOAD_NAMESPACE_DATA,
  LOAD_RESOURCE_DATA,
  SET_SELECTED_NAMESPACE,
  SET_SELECTED_ROLE,
  SET_KEYWORD,
} from '../constants/action-types';

const initialState = {
  namespaces: [],
  selectedNamespace: null,
  resourcesData: [],
  resources: [],
  groups: [],
  users: [],
  keyword: '',
  pagination: {
    page: 1,
    page_size: 10,
    total_count: 0,
  },
};

const userListReducer = (state = initialState, action) => {
  let namespaces;
  switch (action.type) {
    case LOAD_USER_RESOURCE_FILTER:
      return { ...state, resources: action.payload };
    case LOAD_USER_GROUP_FILTER:
      return { ...state, groups: action.payload };
    case LOAD_USER_LIST:
      return { ...state, users: action.payload };
    case LOAD_USER_PAGINATION:
      return { ...state, pagination: action.payload };
    case LOAD_NAMESPACE_DATA:
      namespaces = action.payload || [];
      namespaces.unshift({
        description: '',
        name: 'default',
        path: 'default',
        subresources: [],
        tag: 'default',
      });
      return { ...state, namespaces, selectedNamespace: namespaces[0].tag };
    case LOAD_RESOURCE_DATA:
      return { ...state, resourcesData: action.payload || [] };
    case SET_SELECTED_NAMESPACE:
      return { ...state, selectedNamespace: action.payload };
    case SET_SELECTED_ROLE:
      return { ...state, selectedRole: action.payload };
    case SET_KEYWORD:
      return { ...state, keyword: action.payload };
    default:
      return state;
  }
};

export default userListReducer;
