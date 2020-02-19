import { USE_DUMMY_DATA } from 'common/injectGlobals';
import { find, isNil, omitBy } from 'lodash';
import queryString from 'querystring';

import ajax from 'services/ajax';

import { UserPermission } from 'common/typedefs/UserPermission';
import { clientSideSort } from './clientSideSortUtil';

import dummyApplications from './dummyData/applications';
import dummyGroups from './dummyData/groups';
import dummyUsers from './dummyData/users';

export const getUser = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(dummyUsers.find(user => id === user.id))
    : ajax.get(`/users/${id}`).then(r => r.data);
};

export const getUserGroups = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(
        (find(dummyUsers, user => id === user.id, {}).groups || []).map(groupId =>
          dummyGroups.find(group => groupId === group.id),
        ),
      )
    : ajax.get(`/users/${id}/groups`).then(r => r.data);
};

export const getUserApplications = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(
        (find(dummyUsers, user => id === user.id, {}).applications || []).map(appId =>
          dummyApplications.find(application => appId === application.id),
        ),
      )
    : ajax.get(`/users/${id}/applications`).then(r => r.data);
};

export const getUserAndUserGroupPermissions = ({
  userId,
  offset = 0,
  limit = 20,
  query = null,
  sortField = null,
  sortOrder = null,
}): Promise<{ count: number; resultSet: UserPermission[]; offset: number; limit: number }> => {
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
    .then(r => {
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
    .catch(err => err);
};
