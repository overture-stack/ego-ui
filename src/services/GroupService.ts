import { isNil, omitBy, omit } from 'lodash';
import queryString from 'querystring';

import ajax from 'services/ajax';
import { clientSideSort } from './clientSideSortUtil';
import { Group } from 'common/typedefs/Group';
import { Permission } from 'common/typedefs/Permission';
import {
  CreateEntity,
  AddApplicationToEntity,
  AddToEntity,
  DeleteEntity,
  RemoveApplicationFromEntity,
  RemoveFromEntity,
  UpdateEntity,
} from './types';

// TODO: can rename methods these as get/create/delete + getChildType
// get one
export const getGroup = (id) => {
  return ajax.get(`/groups/${id}`).then((r) => r.data);
};

// get associated
export const getGroupUsers = (id) => {
  return ajax.get(`/groups/${id}/users`).then((r) => r.data);
};

export const getGroupApplications = (id) => {
  return ajax.get(`/groups/${id}/applications`).then((r) => r.data);
};

export const getGroupPermissions = ({
  groupId,
  limit = 20,
  offset = 0,
  query = null,
  sortField = null,
  sortOrder = null,
}): Promise<{ count: number; resultSet: Permission[]; offset: number; limit: number }> => {
  return ajax
    .get(
      `/groups/${groupId}/permissions?${queryString.stringify(
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
    .then((r) => {
      // TODO: implement server side sorting and search
      // for client side pagination
      const sortBy = sortField !== 'policy' ? sortField : 'policy.name';
      const order = sortOrder || 'desc';
      const queryBy = new RegExp(query ? `(${query})` : '', 'i');

      return {
        count: r.data.count,
        limit,
        offset,
        resultSet: clientSideSort(
          r.data.resultSet.slice(offset, offset + limit),
          sortField,
          order,
          sortBy,
        ).filter(
          ({ accessLevel, policy: { name } }) => queryBy.test(accessLevel) || queryBy.test(name),
        ),
      };
    })
    .catch((err) => err);
};

// get list
export const getGroups = ({
  offset = 0,
  limit = 20,
  query = null,
  userId = null,
  applicationId = null,
  sortField = null,
  sortOrder = null,
  status = null,
  policyId = null,
}): Promise<{ count: number; resultSet: Group[]; offset: number; limit: number }> => {
  const baseUrl = userId
    ? `/users/${userId}`
    : applicationId
    ? `/applications/${applicationId}`
    : policyId
    ? `/policies/${policyId}`
    : '';

  // prevent 400 error on /create
  const activeId = userId || applicationId || policyId;
  if (activeId === 'create') {
    Promise.resolve(activeId);
  }

  return ajax
    .get(
      `${baseUrl}/groups?${queryString.stringify(
        omitBy(
          {
            limit,
            offset,
            query,
            sort: sortField,
            sortOrder,
            status: status === 'All' ? null : status,
          },
          isNil,
        ),
      )}`,
    )
    .then((r) => r.data)
    .catch((err) => err);
};

// create
const BLOCKED_KEYS_FOR_CREATE = ['id', 'createdAt', 'lastLogin', 'groups', 'applications'];

export const createGroup: CreateEntity<Group> = ({ item }) => {
  return ajax.post(`/groups`, omit(item, BLOCKED_KEYS_FOR_CREATE)).then((r) => r.data);
};

// update
// TODO: need all add/remove methods relative to group as parent
const BLOCKED_KEYS_FOR_UPDATE = ['groups', 'applications'];

const add: AddToEntity<Group> = ({ entity: group, key, value }: any) => {
  return ajax.post(`/groups/${group.id}/${key}`, [value]).then((r) => r.data);
};

const remove: RemoveFromEntity<Group> = ({ entity: group, key, value }: any) => {
  return ajax.delete(`/groups/${group.id}/${key}/${value}`).then((r) => r.data);
};

export const updateGroup: UpdateEntity<Group> = ({ item }) => {
  return ajax.put(`/groups/${item.id}`, omit(item, BLOCKED_KEYS_FOR_UPDATE)).then((r) => r.data);
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
