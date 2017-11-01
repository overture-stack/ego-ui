import _ from 'lodash';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['groups', 'applications'];

function add({ group, key, value }: any) {
  return ajax.post(`/groups/${group.id}/${key}`, [value]).then(r => r.data);
}

function remove({ group, key, value }: any) {
  return ajax.delete(`/groups/${group.id}/${key}/${value}`).then(r => r.data);
}

export const updateGroup = ({ item }) => {
  return ajax.put(`/groups/${item.id}`, _.omit(item, BLOCKED_KEYS)).then(r => r.data);
};

export const addApplicationToGroup = ({ application, group }) => {
  return add({ group, key: 'applications', value: application.id });
};

export const removeApplicationFromGroup = ({ application, group }) => {
  return remove({ group, key: 'applications', value: application.id });
};
