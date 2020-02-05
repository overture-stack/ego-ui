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

  const policyChildrenSortFields = {
    id: 'owner',
    mask: 'accessLevel',
    name: 'owner',
  };

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
                query,
                sort: isNil(policyId) ? sortField : policyChildrenSortFields[String(sortField)],
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
