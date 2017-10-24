import ajax from 'services/ajax';

function add({ group, key, value }: any) {
  return ajax.post(`/groups/${group.id}/${key}`, [value]).then(r => r.data);
}

function remove({ group, key, value }: any) {
  return ajax.delete(`/groups/${group.id}/${key}/${value}`).then(r => r.data);
}

export const addApplicationToGroup = ({ application, group }) => {
  return add({ group, key: 'applications', value: application.id });
};

export const removeApplicationFromGroup = ({ application, group }) => {
  return remove({ group, key: 'applications', value: application.id });
};
