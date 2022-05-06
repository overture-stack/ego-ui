import { Group } from 'common/typedefs';
import { omit } from 'lodash';
import ajax from 'services/ajax';
import { CreateEntity } from './types';

const BLOCKED_KEYS = ['id', 'createdAt', 'lastLogin', 'groups', 'applications'];

export const createGroup: CreateEntity<Group> = ({ item }) => {
  return ajax.post(`/groups`, omit(item, BLOCKED_KEYS)).then((r) => r.data);
};
