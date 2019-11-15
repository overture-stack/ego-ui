import { USE_DUMMY_DATA } from 'common/injectGlobals';
import { Application } from 'common/typedefs/Application';
import _ from 'lodash';
import queryString from 'querystring';
import ajax from 'services/ajax';

import dummyApplications from './dummyData/applications';

export const getApps = ({
  offset = 0,
  limit = 20,
  query,
  userId,
  groupId,
  sortField,
  sortOrder,
  status,
}): Promise<{ count: number; resultSet: Application[] }> => {
  const baseUrl = userId ? `/users/${userId}` : groupId ? `/groups/${groupId}` : '';

  return USE_DUMMY_DATA
    ? Promise.resolve({
        count: dummyApplications.length,
        resultSet: dummyApplications.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `${baseUrl}/applications?${queryString.stringify(
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
