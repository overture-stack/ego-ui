import _ from 'lodash';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['groups', 'users'];

export const updateApplication = ({ item }) => {
  return ajax.put(`/applications/${item.id}`, _.omit(item, BLOCKED_KEYS)).then(r => r.data);
};

export const deleteApplication = ({ item }) => {
  return ajax.delete(`/applications/${item.id}`).then(r => r.data);
};
