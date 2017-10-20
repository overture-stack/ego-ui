import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import { Application } from 'common/typedefs/Application';

const dummyApps = require('./dummyApps.json') as Application[];

export const getApp = id => {
  return useDummyData
    ? Promise.resolve(dummyApps.find(app => id === app.id))
    : ajax.get(`/applications/${id}`).then(r => r.data);
};
