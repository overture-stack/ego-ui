import 'flexboxgrid/dist/flexboxgrid.css';
import 'index.css';
import 'semantic-ui-css/semantic.min.css';
import 'vanilla-ripplejs';

localStorage.setItem('debug', process.env.REACT_APP_DEBUG || ''); // manually set because CRA doesn't allow arbitrary env variable names.
const debug = require('debug') as Function;
global.log = debug('app');

export const STATUSES = ['DISABLED', 'APPROVED', 'PENDING', 'REJECTED'];
export const DATE_KEYS = ['createdAt', 'lastLogin'];
export const apiRoot = process.env.REACT_APP_API;
export const egoClientId = process.env.REACT_APP_EGO_CLIENT_ID;
export const useDummyData = process.env.REACT_APP_DUMMY;
