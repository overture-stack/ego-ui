import _ from 'lodash';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['id', 'createdAt', 'lastLogin', 'groups', 'applications'];

export const createUser = ({ item }) => {
  return ajax.post('/users', _.omit(item, BLOCKED_KEYS)).then(r => r.data);
};
