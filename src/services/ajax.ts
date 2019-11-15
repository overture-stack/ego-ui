import axios from 'axios';
import { API_ROOT } from 'common/injectGlobals';

const ajax = axios.create({ baseURL: API_ROOT });

export const setAjaxToken = t => {
  localStorage.setItem('user-token', t);
  ajax.defaults.headers.common['Authorization'] = `Bearer ${t}`;
};

export const clearAjaxToken = () => {
  localStorage.removeItem('user-token');
};

export default ajax;
