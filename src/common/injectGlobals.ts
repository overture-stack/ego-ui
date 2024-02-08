import 'flexboxgrid/dist/flexboxgrid.css';
import 'index.css';
import 'semantic-ui-css/semantic.min.css';
import 'vanilla-ripplejs';

localStorage.setItem('debug', process.env.REACT_APP_DEBUG || ''); // manually set because CRA doesn't allow arbitrary env variable names.
const debug = require('debug') as Function;
global.log = debug('app');

export const API_ROOT = process.env.REACT_APP_API;
export const EGO_CLIENT_ID = process.env.REACT_APP_EGO_CLIENT_ID;

export const PUBLIC_PATH = process.env.REACT_APP_PUBLIC_PATH;

export const KEYCLOAK_ENABLED = process.env.REACT_APP_KEYCLOAK_ENABLED === 'true' || false;
export const EGO_PUBLIC_KEY = process.env.REACT_APP_EGO_PUBLIC_KEY;

const createPubsub = () => {
  let listeners = [];
  const subscribe = (callback) => (listeners = listeners.concat(callback));
  const unsubscribe = (callback) =>
    (listeners = listeners.filter((l) => {
      return l !== callback;
    }));
  const publish = (payload) => {
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
