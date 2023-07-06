import { isNil, omitBy } from 'lodash';
import queryString from 'querystring';

import ajax from 'services/ajax';

import { VisaPermission } from 'common/typedefs/VisaPermission';
import { clientSideSort } from './clientSideSortUtil';

export const getVisa = (id) => {
  return ajax
    .get(`/visa/${id}`)
    .then((r) => r.data)
    .catch((err) => err);
};

export const getVisaPermissions = ({
  visaId,
  offset = 0,
  limit = 20,
  query = null,
  sortField = null,
  sortOrder = null,
}): Promise<{ count: number; resultSet: VisaPermission[]; offset: number; limit: number }> => {
  return ajax
    .get(
      `/visa/permissions/${visaId}?${queryString.stringify(
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
