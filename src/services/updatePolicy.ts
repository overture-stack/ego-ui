import { omit } from 'lodash';
import { Group, Policy, User } from 'common/typedefs';
import { MaskLevel } from 'common/typedefs/Permission';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['groups', 'users'];

export interface GroupWithMask extends Group {
  mask: MaskLevel;
}

export interface UserWithMask extends User {
  mask: MaskLevel;
}

// TODO: mask should be passed in as its own argument for each of these add functions, for clarity
// it's possible it's set up this way because of the structure of staged changes, but if it can be refactored it should be
type AddUserPermissionToPolicy = ({
  policy,
  user,
}: {
  policy: Policy;
  user: UserWithMask;
}) => Promise<Policy>;

type AddGroupPermissionToPolicy = ({
  policy,
  group,
}: {
  policy: Policy;
  group: GroupWithMask;
}) => Promise<Policy>;

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
