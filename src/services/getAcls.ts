import _ from 'lodash';
import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import queryString from 'querystring';
import { Acl } from 'common/typedefs/';

import dummyAcls from './dummyData/acls';

export const getAcls = ({
  offset = 0,
  limit = 20,
  query = null,
  sortField = null,
  sortOrder = null,
  status = null,
}): Promise<{ count: number; resultSet: Acl[] }> => {
  return useDummyData
    ? Promise.resolve({
        count: dummyAcls.length,
        resultSet: dummyAcls.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `/acl-entity?${queryString.stringify(
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
