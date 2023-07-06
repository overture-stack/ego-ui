import { omit } from 'lodash';

import ajax from 'services/ajax';

const BLOCKED_KEYS = ['groups', 'users'];

export const updatePolicy = ({ item }) => {
  return ajax
    .put(`/policies/${item.id}`, omit(item, BLOCKED_KEYS))
    .then((r) => r.data)
    .catch((err) => err);
};

export const deletePolicy = ({ item }) => {
  return ajax
    .delete(`/policies/${item.id}`)
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};

export const addUserPermissionToPolicy = ({ policy, user }) => {
  return ajax
    .post(`/policies/${policy.id}/permission/user/${user.id}`, { mask: user.mask })
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};

export const addGroupPermissionToPolicy = ({ policy, group }) => {
  return ajax
    .post(`/policies/${policy.id}/permission/group/${group.id}`, { mask: group.mask })
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};

export const addVisaPermissionToPolicy = ({ policy, visa }) => {
  return ajax
    .post(`/visa/permissions`, { 
      policyId: policy.id,
      visaId: visa.id,
      accessLevel: visa.mask 
    })
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};

export const removeGroupPermissionFromPolicy = ({ policy, group }) => {
  return ajax
    .delete(`/policies/${policy.id}/permission/group/${group.id}`)
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};

export const removeUserPermissionFromPolicy = ({ policy, user }) => {
  return ajax
    .delete(`/policies/${policy.id}/permission/user/${user.id}`)
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};

export const removeVisaFromPolicy = ({ policy, visa }) => {
  return ajax
    .delete(`/visa/${visa.id}/permissions/${policy.id}`)
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};
