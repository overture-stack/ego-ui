import { Schema } from './types';

const schema: Schema = [
  {
    fieldName: 'ID',
    key: 'id',
    sortable: true,
  },
  {
    fieldName: 'Name',
    initialSort: true,
    key: 'name',
    sortable: true,
  },
  {
    fieldName: 'Description',
    key: 'description',
    sortable: true,
  },
  {
    fieldName: 'Status',
    key: 'status',
    sortable: true,
  },
  {
    fieldName: 'Application Type',
    key: 'type',
    sortable: true,
  },
  {
    fieldName: 'Client ID',
    key: 'clientId',
    sortable: false,
  },
  {
    fieldName: 'Redirect Uri',
    key: 'redirectUri',
    sortable: false,
  },
  {
    fieldName: 'Error Redirect Uri',
    key: 'errorRedirectUri',
    sortable: false,
  },
];

const mapTableData = (results) => results;

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
// },
// {
//   fieldName: 'Application Type',
//   fieldType: 'dropdown',
//   key: 'type',
//   options: ['ADMIN', 'CLIENT'],
//   panelSection: 'meta',
//   sortable: true,
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
//   required: true,
// },
// {
//   fieldName: 'Error Redirect Uri',
//   key: 'errorRedirectUri',
//   panelSection: 'meta',
//   required: true,
// },
// ],
