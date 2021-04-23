import axios from 'axios';
import { API_ROOT } from 'common/injectGlobals';

const ajax = axios.create({ baseURL: API_ROOT });

export const setAjaxToken = (token) => {
  ajax.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAjaxToken = () => {
  localStorage.removeItem('user-token');
};

export default ajax;
