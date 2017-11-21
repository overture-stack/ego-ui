import _ from 'lodash';
import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import queryString from 'querystring';
import { Group } from 'common/typedefs/Group';

import dummyGroups from './dummyData/groups';

export const getGroups = ({
  offset = 0,
  limit = 20,
  query,
  userId,
  appId,
  sortField,
  sortOrder,
  status,
}): Promise<{ count: number; resultSet: Group[] }> => {
  const baseUrl = userId ? `/users/${userId}` : appId ? `/applications/${appId}` : '';

  return useDummyData
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
