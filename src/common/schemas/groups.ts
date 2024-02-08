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
    fieldName: 'Status',
    key: 'status',
    sortable: true,
  },
  {
    fieldName: 'Description',
    key: 'description',
    sortable: true,
  },
];

// const mapTableData = (results) => {
//   return results.map((result) => ({
//     ...result,
//     action: 'remove',
//     actionText: 'REMOVE',
//   }));
// };

// const childSchema: Schema = [
//   { key: 'id', fieldName: 'ID', sortable: true, initialSort: true },
//   { key: 'name', fieldName: 'Name', sortable: true },
//   { key: 'mask', fieldName: 'Access Level', sortable: true },
//   { fieldName: 'Action', key: 'action', sortable: false },
// ];

export default schema;

// content panel fields
// [
//   {
//     fieldName: 'ID',
//     immutable: true,
//     key: 'id',
//     panelSection: 'id',
//   },
//   {
//     fieldName: 'Name',
//     initialSort: true,
//     key: 'name',
//     panelSection: 'id',
//     required: true,
//   },
//   {
//     fieldName: 'Status',
//     fieldType: 'dropdown',
//     key: 'status',
//     options: STATUSES,
//     panelSection: 'meta',
//     required: true,
//   },
//   {
//     fieldName: 'Description',
//     key: 'description',
//     panelSection: 'meta',
//   },
//   { fieldName: 'Action', key: 'action', sortable: false },
// ],
