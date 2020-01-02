import { isNil, omitBy } from 'lodash';
import moment from 'moment';
import queryString from 'querystring';
import ajax from 'services/ajax';

import { ApiKey } from 'common/typedefs/ApiKey';

const DATE_FORMAT = 'YYYY-MM-DD hh:mm A';

export const getExpiryDate = expiry => {
  const now = moment().unix();
  return moment((now + expiry) * 1000).format(DATE_FORMAT);
};

export const getApiKeyStatus = expiry => (expiry > 0 ? 'ACTIVE' : 'EXPIRED');

// TODO: align response fields with db
const sortingMap = {
  id: 'name',
  status: 'isRevoked',
  exp: 'expiryDate',
  iss: 'issueDate',
};

export const getApiKeys = ({
  offset = 0,
  limit = 20,
  query,
  userId,
  sortField,
  sortOrder,
}): Promise<{
  count: number;
  resultSet: [ApiKey];
}> => {
  return ajax
    .get(
      `/o/api_key?${queryString.stringify(
        omitBy(
          {
            limit,
            offset,
            query,
            sort: sortingMap[sortField] || sortField,
            sortOrder,
            user_id: userId,
          },
          isNil,
        ),
      )}`,
    )
    .then(r => {
      // is there a better way to do this with RESOURCE_MAP? esp for id -> getKey
      return {
        ...r.data,
        resultSet: r.data.resultSet.map(result => ({
          ...result,
          exp: moment(result.exp).format(DATE_FORMAT),
          id: result.name,
          iss: moment(result.iss).format(DATE_FORMAT),
          revoked: result.isRevoked,
          status: result.isRevoked ? 'REVOKED' : getApiKeyStatus(result.secondsUntilExpiry),
        })),
      };
    });
};
