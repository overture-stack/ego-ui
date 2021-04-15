import { Application } from 'common/typedefs/Application';
import { omitBy, isNil } from 'lodash';
import queryString from 'querystring';
import ajax from 'services/ajax';

export const getApps = ({
  offset = 0,
  limit = 20,
  query = null,
  userId = null,
  groupId = null,
  sortField = null,
  sortOrder = null,
  status = null,
}): Promise<{ count: number; resultSet: Application[]; offset: number; limit: number }> => {
  const baseUrl = userId ? `/users/${userId}` : groupId ? `/groups/${groupId}` : '';

  // prevent 400 error on /create
  const activeId = userId || groupId;
  if (activeId === 'create') {
    Promise.resolve(activeId);
  }

  return ajax
    .get(
      `${baseUrl}/applications?${queryString.stringify(
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
    .then((r) => r.data);
};
