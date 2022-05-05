import moment from 'moment';

import { DATE_FORMAT } from 'common/injectGlobals';
import { getApiKeyStatus } from 'components/Associator/apiKeysUtils';
import { revokeApiKey } from 'services';
import { Schema } from './types';

const mapTableData = (results) => {
  return results.map((result) => ({
    ...result,
    action: revokeApiKey,
    actionText: 'REVOKE',
    expiryDate: moment(result.expiryDate).format(DATE_FORMAT),
    isRevoked: getApiKeyStatus(result),
    issueDate: moment(result.issueDate).format(DATE_FORMAT),
  }));
};

// API keys only have a child table
const schema: Schema = [
  {
    fieldName: 'API Key',
    initialSort: true,
    key: 'name',
    sortable: true,
  },
  {
    fieldName: 'Scope',
    key: 'scope',
    sortable: false,
  },
  {
    fieldName: 'Expiry',
    key: 'expiryDate',
    sortable: true,
  },
  {
    fieldName: 'Issued',
    key: 'issueDate',
    sortable: true,
  },
  {
    fieldName: 'Status',
    key: 'isRevoked',
    sortable: true,
  },
  {
    fieldName: 'Action',
    key: 'action',
    sortable: false,
  },
];

export default schema;
