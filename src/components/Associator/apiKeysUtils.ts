import moment from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD hh:mm A';

export const isExpired = expiry => {
  const exp = moment(expiry).unix();
  const now = moment().unix();
  return exp < now;
};

export const getApiKeyStatus = apiKey => {
  return apiKey.isRevoked ? 'REVOKED' : isExpired(apiKey.expiryDate) ? 'EXPIRED' : 'ACTIVE';
};
