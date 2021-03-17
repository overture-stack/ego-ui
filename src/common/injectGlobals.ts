import 'flexboxgrid/dist/flexboxgrid.css';
import 'index.css';
import 'semantic-ui-css/semantic.min.css';
import 'vanilla-ripplejs';

localStorage.setItem('debug', process.env.REACT_APP_DEBUG || ''); // manually set because CRA doesn't allow arbitrary env variable names.
const debug = require('debug') as Function;
global.log = debug('app');

export const API_ROOT = process.env.REACT_APP_API;
export const EGO_CLIENT_ID = process.env.REACT_APP_EGO_CLIENT_ID;
export const USE_DUMMY_DATA = process.env.REACT_APP_DUMMY;

export const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

export const STATUSES = ['DISABLED', 'APPROVED', 'PENDING', 'REJECTED'];
export const DATE_KEYS = ['createdAt', 'lastLogin'];
export const DATE_FORMAT = 'YYYY-MM-DD hh:mm A';
export const MASK_LEVELS = ['DENY', 'READ', 'WRITE'];

const createPubsub = () => {
  let listeners = [];
  const subscribe = callback => (listeners = listeners.concat(callback));
  const unsubscribe = callback =>
    (listeners = listeners.filter(l => {
      l !== callback;
    }));
  const publish = payload => {
    listeners.forEach((callback: Function) => {
      callback(payload);
    });
  };
  return {
    subscribe,
    unsubscribe,
    listeners,
    publish,
  };
};

export const messenger = createPubsub();
