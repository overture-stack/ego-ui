import { omit } from 'lodash';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['groups', 'applications'];

function add({ user, key, value }: any) {
  return ajax.post(`/users/${user.id}/${key}`, [value]).then((r) => r.data);
}

function remove({ user, key, value }: any) {
  return ajax.delete(`/users/${user.id}/${key}/${value}`).then((r) => r.data);
}

export const updateUser = ({ item }) => {
  return ajax.patch(`/users/${item.id}`, omit(item, BLOCKED_KEYS)).then((r) => r.data);
};

export const addGroupToUser = ({ user, group }) => {
  return add({ user, key: 'groups', value: group.id });
};

export const removeGroupFromUser = ({ user, group }) => {
  return remove({ user, key: 'groups', value: group.id });
};

export const addApplicationToUser = ({ user, application }) => {
  return add({ user, key: 'applications', value: application.id });
};

export const removeApplicationFromUser = ({ user, application }) => {
  return remove({ user, key: 'applications', value: application.id });
};

export const deleteUser = ({ item }) => {
  return ajax.delete(`/users/${item.id}`).then((r) => r.data);
};
