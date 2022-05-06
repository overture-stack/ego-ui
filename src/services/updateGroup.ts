import { Group } from 'common/typedefs';
import { omit } from 'lodash';
import ajax from 'services/ajax';
import {
  AddApplicationToEntity,
  AddToEntity,
  DeleteEntity,
  RemoveApplicationFromEntity,
  RemoveFromEntity,
  UpdateEntity,
} from './types';

const BLOCKED_KEYS = ['groups', 'applications'];

const add: AddToEntity<Group> = ({ entity: group, key, value }: any) => {
  return ajax.post(`/groups/${group.id}/${key}`, [value]).then((r) => r.data);
};

const remove: RemoveFromEntity<Group> = ({ entity: group, key, value }: any) => {
  return ajax.delete(`/groups/${group.id}/${key}/${value}`).then((r) => r.data);
};

export const updateGroup: UpdateEntity<Group> = ({ item }) => {
  return ajax.put(`/groups/${item.id}`, omit(item, BLOCKED_KEYS)).then((r) => r.data);
};

export const addApplicationToGroup: AddApplicationToEntity<Group> = ({ application, entity }) => {
  return add({ entity, key: 'applications', value: application.id });
};

export const removeApplicationFromGroup: RemoveApplicationFromEntity<Group> = ({
  application,
  entity,
}) => {
  return remove({ entity, key: 'applications', value: application.id });
};

export const deleteGroup: DeleteEntity<Group> = ({ item }) => {
  return ajax.delete(`/groups/${item.id}`).then((r) => r.data);
};
