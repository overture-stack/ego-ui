import _ from 'lodash';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['id', 'groups', 'users'];

export const createApplication = ({ item }) => {
  return ajax.post(`/applications`, _.omit(item, BLOCKED_KEYS)).then(r => r.data);
};
