import { isNil, omitBy, omit } from 'lodash';
import queryString from 'querystring';

import ajax from 'services/ajax';
import { Group, Policy, User } from 'common/typedefs';
import { AddUserPermissionToPolicy, AddGroupPermissionToPolicy, CreateEntity } from './types';

// TODO: can rename methods these as get/create/delete + getChildType
// get
export const getPolicy = (id) => {
  return ajax
    .get(`/policies/${id}`)
    .then((r) => r.data)
    .catch((err) => err);
};

// get list
export const getPolicies = ({
  offset = 0,
  limit = 20,
  query = null,
  sortField = null,
  sortOrder = null,
  status = null,
}): Promise<{ count: number; resultSet: Policy[]; offset: number; limit: number }> => {
  return ajax
    .get(
      `/policies?${queryString.stringify(
        omitBy(
          {
            limit,
            name: query,
            offset,
            sort: sortField,
            sortOrder,
          },
          isNil,
        ),
      )}`,
    )
    .then((r) => r.data)
    .catch((err) => err);
};

// create
const BLOCKED_KEYS_FOR_CREATE = ['id', 'groups', 'users'];

export const createPolicy: CreateEntity<Policy> = ({ item }) => {
  return ajax.post(`/policies`, omit(item, BLOCKED_KEYS_FOR_CREATE)).then((r) => r.data);
};

// update
const BLOCKED_KEYS_FOR_UPDATE = ['groups', 'users'];

export const updatePolicy = ({ item }) => {
  return ajax
    .put(`/policies/${item.id}`, omit(item, BLOCKED_KEYS_FOR_UPDATE))
    .then((r) => r.data)
    .catch((err) => err);
};

export const deletePolicy = ({ item }) => {
  return ajax
    .delete(`/policies/${item.id}`)
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};

export const addUserPermissionToPolicy: AddUserPermissionToPolicy = ({ policy, user }) => {
  return ajax
    .post(`/policies/${policy.id}/permission/user/${user.id}`, { mask: user.mask })
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};

export const addGroupPermissionToPolicy: AddGroupPermissionToPolicy = ({ policy, group }) => {
  return ajax
    .post(`/policies/${policy.id}/permission/group/${group.id}`, { mask: group.mask })
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};

type RemoveUserPermissionFromPolicy = ({
  policy,
  user,
}: {
  policy: Policy;
  user: User;
}) => Promise<string>;
type RemoveGroupPermissionFromPolicy = ({
  policy,
  group,
}: {
  policy: Policy;
  group: Group;
}) => Promise<string>;

export const removeGroupPermissionFromPolicy: RemoveGroupPermissionFromPolicy = ({
  policy,
  group,
}) => {
  return ajax
    .delete(`/policies/${policy.id}/permission/group/${group.id}`)
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};

export const removeUserPermissionFromPolicy: RemoveUserPermissionFromPolicy = ({
  policy,
  user,
}) => {
  return ajax
    .delete(`/policies/${policy.id}/permission/user/${user.id}`)
    .then((r) => r.data)
    .catch((err) => console.debug(err));
};
