import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';

import dummyPolicies from './dummyData/policy';

export const getPolicy = id => {
  return useDummyData
    ? Promise.resolve(dummyPolicies.find(policy => id === policy.id))
    : ajax.get(`/policies/${id}`).then(r => r.data);
};

export const getPolicyUsers = async id => {
  return ajax.get(`/policies/${id}/users`).then(r => r.data);
};

export const getPolicyGroups = async id => {
  return ajax.get(`/policies/${id}/groups`).then(r => r.data);
};
