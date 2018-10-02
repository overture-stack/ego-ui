import _ from 'lodash';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['id', 'groups', 'users', 'applications'];

export const createAcl = ({ item }) => {
  return ajax.post(`/acl-entity`, _.omit(item, BLOCKED_KEYS)).then(r => r.data);
};
