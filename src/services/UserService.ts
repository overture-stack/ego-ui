import { isNil, omitBy, omit } from 'lodash';
import queryString from 'querystring';

import ajax from 'services/ajax';
import { Permission } from 'common/typedefs/Permission';
import { User } from 'common/typedefs/User';
import { clientSideSort } from './clientSideSortUtil';
import {
  AddApplicationToEntity,
  AddGroupToEntity,
  AddToEntity,
  RemoveApplicationFromEntity,
  RemoveFromEntity,
  RemoveGroupFromEntity,
  UpdateEntity,
} from 'services/types';

// TODO: can rename methods these as get + getChildType
// get one
export const getUser = (id) => {
  return ajax.get(`/users/${id}`).then((r) => r.data);
};

// get associated
export const getUserGroups = (id) => {
  return ajax.get(`/users/${id}/groups`).then((r) => r.data);
};

export const getUserApplications = (id) => {
  return ajax.get(`/users/${id}/applications`).then((r) => r.data);
};

export const getUserAndUserGroupPermissions = ({
  userId,
  offset = 0,
  limit = 20,
  query = null,
  sortField = null,
  sortOrder = null,
}): Promise<{ count: number; resultSet: Permission[]; offset: number; limit: number }> => {
  return ajax
    .get(
      `/users/${userId}/groups/permissions?${queryString.stringify(
        omitBy(
          {
            limit,
            offset,
            query,
            sort: sortField,
            sortOrder,
          },
          isNil,
        ),
      )}`,
    )
    .then((r) => {
      // for client side pagination, search and sorting
      const sortBy = sortField !== 'policy' ? sortField : 'policy.name';
      const order = sortOrder || 'desc';
      const queryBy = new RegExp(query ? `(${query})` : '', 'i');

      return {
        count: r.data.length,
        limit,
        offset,
        resultSet: clientSideSort(
          r.data.slice(offset, offset + limit),
          sortField,
          order,
          sortBy,
        ).filter(
          ({ accessLevel, ownerType, policy: { name } }) =>
            queryBy.test(accessLevel) || queryBy.test(ownerType) || queryBy.test(name),
        ),
      };
    })
    .catch((err) => err);
};

// get list
export const getUsers = ({
  offset = 0,
  limit = 20,
  query = null,
  sortField = null,
  sortOrder = null,
  groupId = null,
  applicationId = null,
  policyId = null,
  status = null,
}): Promise<{ count: number; resultSet: User[]; offset: number; limit: number }> => {
  const baseUrl = groupId
    ? `/groups/${groupId}`
    : applicationId
    ? `/applications/${applicationId}`
    : policyId
    ? `/policies/${policyId}`
    : '';

  return ajax
    .get(
      `${baseUrl}/users?${queryString.stringify(
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
    .catch((err) => console.log('Error: ', err));
};

// update
const BLOCKED_KEYS_FOR_UPDATE = ['groups', 'applications'];

// "key" should be renamed to "childResource" or something like that
// "value" should renamed to "childId"
const add: AddToEntity<User> = ({ entity, key, value }: any) => {
  return ajax.post(`/users/${entity.id}/${key}`, [value]).then((r) => r.data);
};

const remove: RemoveFromEntity<User> = ({ entity, key, value }) => {
  return ajax.delete(`/users/${entity.id}/${key}/${value}`).then((r) => r.data);
};

export const updateUser: UpdateEntity<User> = ({ item }) => {
  return ajax.patch(`/users/${item.id}`, omit(item, BLOCKED_KEYS_FOR_UPDATE)).then((r) => r.data);
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
