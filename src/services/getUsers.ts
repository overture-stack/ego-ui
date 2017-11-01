import _ from 'lodash';
import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import queryString from 'querystring';
import { User } from 'common/typedefs/User';
import dummyUsers from './dummyData/users';

export const getUsers = ({
  offset = 0,
  limit = 20,
  query = '',
  sortField,
  sortOrder,
}): Promise<{ count: number; resultSet: User[] }> => {
  return useDummyData
    ? Promise.resolve({
        count: dummyUsers.length,
        resultSet: dummyUsers.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `/users?${queryString.stringify(
            _.omitBy({ limit, offset, query, sort: sortField, sortOrder }, _.isNil),
          )}`,
        )
        .then(r => r.data);
};
