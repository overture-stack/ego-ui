import { FieldNames } from 'components/Content/types';
import { Schema } from './types';

const schema: Schema = [
  {
    fieldName: FieldNames.ID,
    key: 'id',
    sortable: true,
  },
  {
    fieldName: FieldNames.NAME,
    initialSort: true,
    key: 'name',
    sortable: true,
  },
  {
    fieldName: FieldNames.DESCRIPTION,
    key: 'description',
    sortable: true,
  },
  {
    fieldName: FieldNames.STATUS,
    key: 'status',
    sortable: true,
  },
  {
    fieldName: FieldNames.APPLICATION_TYPE,
    key: 'type',
    sortable: true,
  },
  {
    fieldName: FieldNames.CLIENT_ID,
    key: 'clientId',
    sortable: false,
  },
  {
    fieldName: FieldNames.REDIRECT_URI,
    key: 'redirectUri',
    sortable: false,
  },
  {
    fieldName: FieldNames.ERROR_REDIRECT_URI,
    key: 'errorRedirectUri',
    sortable: false,
  },
];

// const mapTableData = (results) => results;

export default schema;
// childSchema: [],

// content panel fields
// {
//   fieldName: 'ID',
//   immutable: true,
//   key: 'id',
//   panelSection: 'id',
//   sortable: true,
// },
// {
//   fieldName: 'Name',
//   initialSort: true,
//   key: 'name',
//   panelSection: 'id',
//   required: true,
//   sortable: true,
// },
// {
//   fieldName: 'Description',
//   key: 'description',
//   panelSection: null,
//   sortable: true,
// },
// {
//   fieldName: 'Status',
//   fieldType: 'dropdown',
//   key: 'status',
//   options: STATUSES,
//   panelSection: 'meta',
//   sortable: true,
//  not nullable in ego, change to required
// },
// {
//   fieldName: 'Application Type',
//   fieldType: 'dropdown',
//   key: 'type',
//   options: ['ADMIN', 'CLIENT'],
//   panelSection: 'meta',
//   sortable: true,
//  not nullable in ego, change to required
// },
// {
//   fieldName: 'Client ID',
//   key: 'clientId',
//   panelSection: 'meta',
//   required: true,
// },
// {
//   fieldName: 'Client Secret',
//   key: 'clientSecret',
//   panelSection: 'meta',
//   required: true,
// },
// {
//   fieldName: 'Redirect Uri',
//   key: 'redirectUri',
//   panelSection: 'meta',
//   required: true, -> nullable in ego, should be false
// },
// {
//   fieldName: 'Error Redirect Uri',
//   key: 'errorRedirectUri',
//   panelSection: 'meta',
//   required: true, -> nullable in ego, should be false
// },
// ],
