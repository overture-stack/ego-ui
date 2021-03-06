import { Group } from 'common/typedefs/Group';
import { isNil, omitBy } from 'lodash';
import queryString from 'querystring';
import ajax from 'services/ajax';

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

  // prevent 400 error on /create
  const activeId = userId || applicationId || policyId;
  if (activeId === 'create') {
    Promise.resolve(activeId);
  }

  return ajax
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
    .then((r) => r.data)
    .catch((err) => err);
};
