import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import queryString from 'querystring';
import { Group } from 'common/typedefs/Group';

const dummyGroups = require('./dummyGroups.json') as Group[];

export const getGroups = (
  offset = 0,
  limit = 20,
): Promise<{ count: number; results: Group[] }> => {
  return useDummyData
    ? Promise.resolve({
        count: dummyGroups.length,
        results: dummyGroups.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `/groups?${queryString.stringify({
            limit,
            offset,
          })}`,
        )
        .then(r => r.data);
};
