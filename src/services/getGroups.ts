import { USE_DUMMY_DATA } from 'common/injectGlobals';
import { Group } from 'common/typedefs/Group';
import _ from 'lodash';
import queryString from 'querystring';
import ajax from 'services/ajax';

import dummyGroups from './dummyData/groups';

export const getGroups = ({
  offset = 0,
  limit = 20,
  query,
  userId,
  applicationId,
  sortField,
  sortOrder,
  status,
}): Promise<{ count: number; resultSet: Group[] }> => {
  const baseUrl = userId
    ? `/users/${userId}`
    : applicationId
    ? `/applications/${applicationId}`
    : '';

  return USE_DUMMY_DATA
    ? Promise.resolve({
        count: dummyGroups.length,
        resultSet: dummyGroups.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `${baseUrl}/groups?${queryString.stringify(
            _.omitBy(
              {
                limit,
                offset,
                query,
                sort: sortField,
                sortOrder,
                status: status === 'All' ? null : status,
              },
              _.isNil,
            ),
          )}`,
        )
        .then(r => r.data);
};
