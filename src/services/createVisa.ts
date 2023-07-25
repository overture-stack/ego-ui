import _ from 'lodash';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['id', 'createdAt', 'lastLogin', 'groups', 'applications'];

export const createVisa = ({ item }) => {
  return ajax.post(`/visas`, _.omit(item, BLOCKED_KEYS)).then(r => {
    return r.data
  });
};
