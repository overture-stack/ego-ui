import _ from 'lodash';
import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import queryString from 'querystring';
import { User } from 'common/typedefs/User';
import dummyUsers from './dummyData/users';

export const getUsers = ({
  offset = 0,
  limit = 20,
  query = null,
  sortField = null,
  sortOrder = null,
  groupsId = null,
  appsId = null,
}): Promise<{ count: number; resultSet: User[] }> => {
  const baseUrl = groupsId ? `/groups/${groupsId}` : appsId ? `/applications/${appsId}` : '';
  return useDummyData
    ? Promise.resolve({
        count: dummyUsers.length,
        resultSet: dummyUsers.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `${baseUrl}/users?${queryString.stringify(
            _.omitBy({ limit, offset, query, sort: sortField, sortOrder }, _.isNil),
          )}`,
        )
        .then(r => r.data);
};
