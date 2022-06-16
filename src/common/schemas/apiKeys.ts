import moment from 'moment';

import { DATE_FORMAT } from 'common/constants';
import { getApiKeyStatus } from 'components/Associator/apiKeysUtils';
import { revokeApiKey } from 'services';
import { Schema } from './types';
import { FieldNames } from 'components/Content/types';

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
    fieldName: FieldNames.API_KEY,
    initialSort: true,
    key: 'name',
    sortable: true,
  },
  {
    fieldName: FieldNames.SCOPE,
    key: 'scope',
    sortable: false,
  },
  {
    fieldName: FieldNames.EXPIRY,
    key: 'expiryDate',
    sortable: true,
  },
  {
    fieldName: FieldNames.ISSUED,
    key: 'issueDate',
    sortable: true,
  },
  {
    fieldName: FieldNames.STATUS,
    key: 'isRevoked',
    sortable: true,
  },
  // {
  //   fieldName: 'Action',
  //   key: 'action',
  //   sortable: false,
  // },
];

export default schema;
