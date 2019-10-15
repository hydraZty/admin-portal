import { LOAD_USER_DATA } from '../constants/action-types';

import API from '../utils/API';


export const loadUserData = () => (dispatch) => API.get('/user/user').then(resp => dispatch({ type: LOAD_USER_DATA, payload: resp.data }));


export default {
  loadUserData,
};
