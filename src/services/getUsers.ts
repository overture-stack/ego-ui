import { USE_DUMMY_DATA } from 'common/injectGlobals';
import { User } from 'common/typedefs/User';
import { isNil, omitBy, orderBy } from 'lodash';
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
}): Promise<{ count: number; resultSet: User[]; offset: number; limit: number }> => {
  const baseUrl = groupId
    ? `/groups/${groupId}`
    : applicationId
    ? `/applications/${applicationId}`
    : policyId
    ? `/policies/${policyId}`
    : '';

  // prevent 400 error on /create
  const activeId = groupId || applicationId || policyId;
  if (activeId === 'create') {
    Promise.resolve(activeId);
  }

  return USE_DUMMY_DATA
    ? Promise.resolve({
        count: dummyUsers.length,
        resultSet: dummyUsers.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `${baseUrl}/users?${queryString.stringify(
            omitBy(
              {
                limit,
                offset,
                // TODO: using client side or server side pagination for policy/assoc?
                // query: policyId ? null : query,
                // sort: policyId ? null : sortField,
                query,
                // seems like backend sort for accessLevel is based on hierarchy of levels, not alphabetically?
                sort: sortField === 'mask' ? 'accessLevel' : sortField,
                sortOrder,
                status: status === 'All' ? null : status,
              },
              isNil,
            ),
          )}`,
        )
        .then(r => r.data)
        .catch(err => err);
};
