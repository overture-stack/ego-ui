import { USE_DUMMY_DATA } from 'common/injectGlobals';
import { Group } from 'common/typedefs/Group';
import { isNil, omitBy, orderBy } from 'lodash';
import queryString from 'querystring';
import ajax from 'services/ajax';

import dummyGroups from './dummyData/groups';

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
  return USE_DUMMY_DATA
    ? Promise.resolve({
        count: dummyGroups.length,
        resultSet: dummyGroups.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `${baseUrl}/groups?${queryString.stringify(
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
