import { Application } from 'common/typedefs';
import { omit } from 'lodash';
import ajax from 'services/ajax';
import { DeleteEntity, UpdateEntity } from './types';

const BLOCKED_KEYS = ['groups', 'users'];

export const updateApplication: UpdateEntity<Application> = ({ item }) => {
  return ajax.put(`/applications/${item.id}`, omit(item, BLOCKED_KEYS)).then((r) => r.data);
};

export const deleteApplication: DeleteEntity<Application> = ({ item }) => {
  return ajax.delete(`/applications/${item.id}`).then((r) => r.data);
};
