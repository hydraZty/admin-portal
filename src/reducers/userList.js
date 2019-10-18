import {
  LOAD_USER_RESOURCE_FILTER,
  LOAD_USER_GROUP_FILTER,
  LOAD_USER_ROLE_FILTER,
  LOAD_USER_LIST,
  LOAD_USER_PAGINATION,
  LOAD_NAMESPACE_DATA,
  LOAD_RESOURCE_DATA,
  SET_SELECTED_NAMESPACE,
} from '../constants/action-types';

const initialState = {
  namespaces: [],
  selectedNamespace: null,
  resourcesData: [],
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
  let namespaces;
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
    default:
      return state;
  }
};

export default userListReducer;