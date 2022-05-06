import { Application } from 'common/typedefs';
import { omit } from 'lodash';
import ajax from 'services/ajax';
import { CreateEntity } from './types';

const BLOCKED_KEYS = ['id', 'groups', 'users'];

export const createApplication: CreateEntity<Application> = ({ item }) => {
  return ajax.post(`/applications`, omit(item, BLOCKED_KEYS)).then((r) => r.data);
};
