import axios from 'axios';
import { apiRoot } from 'common/injectGlobals';

const ajax = axios.create({ baseURL: apiRoot });

export const setAjaxToken = t => {
  localStorage.setItem('user-token', t);
  ajax.defaults.headers.common['Authorization'] = `Bearer ${t}`;
};

export const clearAjaxToken = () => {
  localStorage.removeItem('user-token');
};

export default ajax;
