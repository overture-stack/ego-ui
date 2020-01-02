import moment from 'moment';
import ajax from 'services/ajax';

const DATE_FORMAT = 'YYYY-MM-DD hh:mm A';

export const getExpiryDate = expiry => {
  const now = moment().unix();
  return moment((now + expiry) * 1000).format(DATE_FORMAT);
};

export const getApiKeyStatus = expiry => (expiry > 0 ? 'ACTIVE' : 'EXPIRED');

export const getApiKeys = ({ userId }) => {
  return ajax.get(`/o/api_key?user_id=${userId}`).then(r => {
    // is there a better way to do this with RESOURCE_MAP?
    return {
      ...r.data,
      resultSet: r.data.resultSet.map(result => ({
        ...result,
        exp: getExpiryDate(result.exp),
        id: result.apiKey,
        iss: moment(result.iss).format(DATE_FORMAT),
        status: getApiKeyStatus(result.exp),
      })),
    };
  });
};
