import { USE_DUMMY_DATA } from 'common/injectGlobals';
import { Group } from 'common/typedefs/Group';
import { isNil, omitBy } from 'lodash';
import queryString from 'querystring';
import ajax from 'services/ajax';

import dummyGroups from './dummyData/groups';

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

  return USE_DUMMY_DATA
    ? Promise.resolve({
        count: dummyGroups.length,
        resultSet: dummyGroups.slice(offset, offset + limit),
      })
    : ajax
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
        .then(r => {
          // TODO: /policies/{id}/groups does not return paginated response
          if (policyId) {
            return {
              resultSet: r.data,
              count: r.data.length,
              limit,
              offset,
            };
          }
          return r.data;
        })
        .catch(err => err);
};
