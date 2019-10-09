import { LOAD_USER_DATA } from '../constants/action-types';

import { fence } from '../utils/API';


export const loadUserData = () => (dispatch) => fence.get('/user').then(resp => dispatch({ type: LOAD_USER_DATA, payload: resp }));


export default {
  loadUserData,
};
