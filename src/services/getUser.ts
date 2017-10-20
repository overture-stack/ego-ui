import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import { User } from 'common/typedefs/User';

const dummyUsers = require('./dummyUsers.json') as User[];

export const getUser = id => {
  return useDummyData
    ? Promise.resolve(dummyUsers.find(user => id === user.id))
    : ajax.get(`/users/${id}`).then(r => r.data);
};
