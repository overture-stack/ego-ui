import { User } from 'common/typedefs/User';
import { isNil, omitBy } from 'lodash';
import queryString from 'querystring';
import ajax from 'services/ajax';

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

  return ajax
    .get(
      `${baseUrl}/users?${queryString.stringify(
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
    .then((r) => r.data)
    .catch((err) => console.log('Error: ', err));
};
