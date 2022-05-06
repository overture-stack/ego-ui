import { Policy } from 'common/typedefs';
import { omit } from 'lodash';
import ajax from 'services/ajax';
import { CreateEntity } from './types';

const BLOCKED_KEYS = ['id', 'groups', 'users'];

export const createPolicy: CreateEntity<Policy> = ({ item }) => {
  return ajax.post(`/policies`, omit(item, BLOCKED_KEYS)).then((r) => r.data);
};
