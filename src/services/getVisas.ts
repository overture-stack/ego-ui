import { isNil, omitBy } from 'lodash';
import queryString from 'querystring';

import { Visa } from 'common/typedefs/Visa';
import ajax from 'services/ajax';

export const getVisas = ({
  offset = 0,
  limit = 20,
  query = null,
  sortField = null,
  sortOrder = null,
  status = null,
}): Promise<{ count: number; resultSet: Visa[]; offset: number; limit: number }> => {
  return ajax
    .get(
      `/visas?${queryString.stringify(
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
    .then(r => r.data)
    .catch(err => err);
};
