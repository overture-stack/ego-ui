import { USE_DUMMY_DATA } from 'common/injectGlobals';
import { omit } from 'lodash';
import ajax from 'services/ajax';
import dummyUsers from './dummyData/users';

const BLOCKED_KEYS = ['groups', 'users'];

export const updatePolicy = ({ item }) => {
  return ajax
    .put(`/policies/${item.id}`, omit(item, BLOCKED_KEYS))
    .then(r => r.data)
    .catch(err => err);
};

export const deletePolicy = ({ item }) => {
  return ajax
    .delete(`/policies/${item.id}`)
    .then(r => r.data)
    .catch(err => console.debug(err));
};

export const addUserPermissionToPolicy = ({ policy, user }) => {
  return ajax
    .post(`/policies/${policy.id}/permission/user/${user.id}`, { mask: user.mask })
    .then(r => r.data)
    .catch(err => console.debug(err));
};

export const addGroupPermissionToPolicy = ({ policy, group }) => {
  return ajax
    .post(`/policies/${policy.id}/permission/group/${group.id}`, { mask: group.mask })
    .then(r => r.data)
    .catch(err => console.debug(err));
};

// function add({ user, key, value }: any) {
//   return ajax.post(`/users/${user.id}/${key}`, [value]).then(r => r.data);
// }

// export const addApplicationToUser = ({ user, application }) => {
//   return add({ user, key: 'applications', value: application.id });
// };
