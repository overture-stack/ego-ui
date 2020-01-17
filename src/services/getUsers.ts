import { USE_DUMMY_DATA } from 'common/injectGlobals';
import { User } from 'common/typedefs/User';
import _ from 'lodash';
import queryString from 'querystring';
import ajax from 'services/ajax';
import dummyUsers from './dummyData/users';

export const getUsers = ({
  offset = 0,
  limit = 20,
  query = null,
  sortField = null,
  sortOrder = null,
  groupId = null,
  applicationId = null,
  policyId = null,
  status = null,
}): Promise<{ count: number; resultSet: User[] }> => {
  const baseUrl = groupId
    ? `/groups/${groupId}`
    : applicationId
    ? `/applications/${applicationId}`
    : policyId
    ? `/policies/${policyId}`
    : '';
  return USE_DUMMY_DATA
    ? Promise.resolve({
        count: dummyUsers.length,
        resultSet: dummyUsers.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `${baseUrl}/users?${queryString.stringify(
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
        .then(r => {
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
