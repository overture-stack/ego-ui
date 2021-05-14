import { isNil, omitBy } from 'lodash';
import queryString from 'querystring';

import ajax from 'services/ajax';

import { Permission } from 'common/typedefs/Permission';
import { clientSideSort } from './clientSideSortUtil';

export const getUser = (id) => {
  return ajax.get(`/users/${id}`).then((r) => r.data);
};

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
