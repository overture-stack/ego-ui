import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import queryString from 'querystring';
import { Application } from 'common/typedefs/Application';

const dummyApps = require('./dummyApps.json') as Application[];

export const getApps = (
  offset = 0,
  limit = 20,
): Promise<{ count: number; results: Application[] }> => {
  return useDummyData
    ? Promise.resolve({
        count: dummyApps.length,
        results: dummyApps.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `/applications?${queryString.stringify({
            limit,
            offset,
          })}`,
        )
        .then(r => r.data);
};
