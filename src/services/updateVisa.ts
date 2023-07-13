import { omit } from 'lodash';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['groups', 'applications'];

export const updateVisa = ({ item }) => {
  return ajax.put(`/visas/${item.id}`, omit(item, BLOCKED_KEYS)).then((r) => r.data);
};

export const deleteVisa = ({ item }) => {
  return ajax.delete(`/visas/${item.id}`).then((r) => r.data);
};
