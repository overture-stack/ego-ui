import { omit } from 'lodash';

import { User } from 'common/typedefs';
import {
  AddApplicationToEntity,
  AddGroupToEntity,
  AddToEntity,
  RemoveApplicationFromEntity,
  RemoveFromEntity,
  RemoveGroupFromEntity,
  UpdateEntity,
} from 'services/types';
import ajax from 'services/ajax';

const BLOCKED_KEYS = ['groups', 'applications'];

const add: AddToEntity<User> = ({ entity, key, value }: any) => {
  return ajax.post(`/users/${entity.id}/${key}`, [value]).then((r) => r.data);
};

const remove: RemoveFromEntity<User> = ({ entity, key, value }) => {
  return ajax.delete(`/users/${entity.id}/${key}/${value}`).then((r) => r.data);
};

export const updateUser: UpdateEntity<User> = ({ item }) => {
  return ajax.patch(`/users/${item.id}`, omit(item, BLOCKED_KEYS)).then((r) => r.data);
};

export const addGroupToUser: AddGroupToEntity<User> = ({ entity, group }) => {
  return add({ entity, key: 'groups', value: group.id });
};

export const removeGroupFromUser: RemoveGroupFromEntity<User> = ({ entity, group }) => {
  return remove({ entity, key: 'groups', value: group.id });
};

export const addApplicationToUser: AddApplicationToEntity<User> = ({ entity, application }) => {
  return add({ entity, key: 'applications', value: application.id });
};

export const removeApplicationFromUser: RemoveApplicationFromEntity<User> = ({
  entity,
  application,
}) => {
  return remove({ entity, key: 'applications', value: application.id });
};
