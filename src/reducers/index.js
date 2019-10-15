import { combineReducers } from 'redux';

import userReducer from './user';
import userListReducer from './userList';

const rootReducer = combineReducers({
  user: userReducer,
  userList: userListReducer,
});

export default rootReducer;
