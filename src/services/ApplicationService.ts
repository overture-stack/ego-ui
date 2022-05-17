import { omit, omitBy, isNil } from 'lodash';
import queryString from 'querystring';

import ajax from 'services/ajax';
import { Application } from 'common/typedefs';
import { CreateEntity, DeleteEntity, UpdateEntity } from './types';

// TODO: can rename methods these as get/create/delete + getChildType
// get one
export const getApp = (id) => {
  return ajax.get(`/applications/${id}`).then((r) => r.data);
};

// get associated
export const getAppUsers = (id) => {
  return ajax.get(`/applications/${id}/users`).then((r) => r.data);
};

export const getAppGroups = (id) => {
  return ajax.get(`/applications/${id}/groups`).then((r) => r.data);
};

// get list
export const getApps = ({
  offset = 0,
  limit = 20,
  query = null,
  userId = null,
  groupId = null,
  sortField = null,
  sortOrder = null,
  status = null,
}): Promise<{ count: number; resultSet: Application[]; offset: number; limit: number }> => {
  // TODO: same comment as in UserService getUsers call, find out what this is for
  const baseUrl = userId ? `/users/${userId}` : groupId ? `/groups/${groupId}` : '';

  // prevent 400 error on /create
  const activeId = userId || groupId;
  if (activeId === 'create') {
    Promise.resolve(activeId);
  }

  return ajax
    .get(
      `${baseUrl}/applications?${queryString.stringify(
        omitBy(
          {
            limit,
            offset,
            query,
            sort: sortField.key,
            sortOrder,
            status: status === 'All' ? null : status,
          },
          isNil,
        ),
      )}`,
    )
    .then((r) => r.data);
};

// create
const BLOCKED_KEYS_FOR_CREATE = ['id', 'groups', 'users'];

export const createApplication: CreateEntity<Application> = ({ item }) => {
  return ajax.post(`/applications`, omit(item, BLOCKED_KEYS_FOR_CREATE)).then((r) => r.data);
};

// update
// TODO: need all add/remove methods relative to application as parent
const BLOCKED_KEYS_FOR_UPDATE = ['groups', 'users'];

export const updateApplication: UpdateEntity<Application> = ({ item }) => {
  return ajax
    .put(`/applications/${item.id}`, omit(item, BLOCKED_KEYS_FOR_UPDATE))
    .then((r) => r.data);
};

export const deleteApplication: DeleteEntity<Application> = ({ item }) => {
  return ajax.delete(`/applications/${item.id}`).then((r) => r.data);
};
