import axios from 'axios';
import { apiRoot } from 'common/injectGlobals';

const ajax = axios.create({ baseURL: apiRoot });

export default ajax;
