import { USE_DUMMY_DATA } from 'common/injectGlobals';
import { find, omit, uniq } from 'lodash';
import ajax from 'services/ajax';
import dummyUsers from './dummyData/users';

const BLOCKED_KEYS = ['groups', 'applications']; // TODO: need to add permissions here?
function add({ user, key, value }: any) {
  if (USE_DUMMY_DATA) {
    const foundUser = find(dummyUsers, u => u.id === user.id);
    if (foundUser) {
      foundUser[key] = uniq([...foundUser[key], value]);
    }
    return Promise.resolve();
  } else {
    return ajax.post(`/users/${user.id}/${key}`, [value]).then(r => r.data);
  }
}

function remove({ user, key, value }: any) {
  if (USE_DUMMY_DATA) {
    const foundUser = find(dummyUsers, u => u.id === user.id);
    if (foundUser) {
      foundUser[key] = foundUser[key].filter(id => id !== value);
    }
    return Promise.resolve();
  } else {
    return ajax.delete(`/users/${user.id}/${key}/${value}`).then(r => r.data);
  }
}

export const updateUser = ({ item }) => {
  return ajax.put(`/users/${item.id}`, omit(item, BLOCKED_KEYS)).then(r => r.data);
};

// use to add an inherited permission -> you're adding by searching policies, will adding a permission
// always create a direct user - permission relationship?
export const addGroupToUser = ({ user, group }) => {
  return add({ user, key: 'groups', value: group.id });
};

// use to remove an inherited permission
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
  return ajax.delete(`/users/${item.id}`).then(r => r.data);
};

// add and remove happens one at a time, with their own post/delete requests
// If it is a user permission, the remove the permission from the user.
// If it is a group based permission, then remove the user from that group.
export const addPermissionToUser = ({ user, permission }) => {
  const newPermission = { policyId: permission.policy.id, mask: permission.accessLevel };
  return add({ user, key: 'permissions', value: newPermission });
};

export const removePermissionFromUser = ({ user, permission }) =>
  remove({ user, key: 'permissions', value: permission.id });
