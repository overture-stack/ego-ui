import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import { Group } from 'common/typedefs/Group';

const dummyGroups = require('./dummyGroups.json') as Group[];

export const getGroup = id => {
  return useDummyData
    ? Promise.resolve(dummyGroups.find(group => id === group.id))
    : ajax.get(`/groups/${id}`).then(r => r.data);
};
