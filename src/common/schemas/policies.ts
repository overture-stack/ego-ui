import { Schema } from './types';

const schema: Schema = [
  {
    fieldName: 'ID',
    initialSort: true,
    key: 'id',
    sortable: true,
  },
  {
    fieldName: 'Name',
    key: 'name',
    sortable: true,
  },
];

const mapTableData = (results) => results;

const childSchema: Schema = [
  { key: 'id', fieldName: 'ID', sortable: true, initialSort: true },
  { key: 'name', fieldName: 'Name', sortable: true },
  { key: 'mask', fieldName: 'Access Level', sortable: true },
  { fieldName: 'Action', key: 'action', sortable: false },
];

export default schema;

// content panel fields
// {
//   fieldName: 'ID',
//   immutable: true,
//   initialSort: true,
//   key: 'id',
//   panelSection: 'id',
// },
// {
//   fieldName: 'Name',
//   key: 'name',
//   panelSection: 'id',
//   required: true,
// },
