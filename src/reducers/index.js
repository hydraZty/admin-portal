import { LOAD_USER_DATA } from '../constants/action-types';

const initialState = {
  currentUser: null,
};

const rootReducer = (state = initialState, action) => {
  if (action.type === LOAD_USER_DATA) {
    return { ...state, currentUser: action.payload };
  }

  return state;
};

export default rootReducer;
