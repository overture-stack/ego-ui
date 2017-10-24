import _ from 'lodash';
import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import queryString from 'querystring';
import { Group } from 'common/typedefs/Group';

import dummyGroups from './dummyData/groups';

export const getGroups = ({
  offset = 0,
  limit = 20,
  query = '',
}): Promise<{ count: number; resultSet: Group[] }> => {
  return useDummyData
    ? Promise.resolve({
        count: dummyGroups.length,
        resultSet: dummyGroups.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `/groups?${queryString.stringify(
            _.omitBy({ limit, offset, query }, _.isNil),
          )}`,
        )
        .then(r => r.data);
};
