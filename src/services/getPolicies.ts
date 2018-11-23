import _ from 'lodash';
import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import queryString from 'querystring';
import { Policy } from 'common/typedefs/Policy';
import dummyPolicies from './dummyData/policy';

export const getPolicies = ({
  offset = 0,
  limit = 20,
  query = null,
  sortField = null,
  sortOrder = null,
  groupId = null,
  applicationId = null,
  status = null,
}): Promise<{ count: number; resultSet: Policy[] }> => {
  return useDummyData
    ? Promise.resolve({
      count: dummyPolicies.length,
      resultSet: dummyPolicies.slice(offset, offset + limit),
    })
    : ajax
      .get(
        `/policies?${queryString.stringify(
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
