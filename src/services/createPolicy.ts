import { omit } from 'lodash';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['id', 'groups', 'users'];

export const createPolicy = ({ item }) => {
  return ajax.post(`/policies`, omit(item, BLOCKED_KEYS)).then(r => r.data);
};
