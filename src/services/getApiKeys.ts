import { isNil, omitBy } from 'lodash';
import queryString from 'querystring';
import ajax from 'services/ajax';

import { ApiKey } from 'common/typedefs/ApiKey';

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
            sort: sortField,
            sortOrder,
            user_id: userId,
          },
          isNil,
        ),
      )}`,
    )
    .then(r => r.data)
    .catch(err => console.debug(err));
};

export const revokeApiKey = (item): Promise<string> => {
  return ajax
    .delete(`/o/api_key?apiKey=${item.name}`)
    .then(r => r)
    .catch(err => err);
};
