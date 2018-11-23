import ajax from 'services/ajax';
import _ from 'lodash';
import { useDummyData } from 'common/injectGlobals';

import dummyPolicies from './dummyData/policy';

export const getPolicy = id => {
  return useDummyData
    ? Promise.resolve(dummyPolicies.find(user => id === user.id))
    : ajax.get(`/policies/${id}`).then(r => r.data);
};