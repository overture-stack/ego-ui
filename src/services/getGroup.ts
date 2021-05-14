import { Permission } from 'common/typedefs/Permission';
import { isNil, omitBy } from 'lodash';
import queryString from 'querystring';

import ajax from 'services/ajax';
import { clientSideSort } from './clientSideSortUtil';

export const getGroup = (id) => {
  return ajax.get(`/groups/${id}`).then((r) => r.data);
};

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
