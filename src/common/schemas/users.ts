import { Schema } from './types';

const schema: Schema = [
  {
    fieldName: 'ID',
    key: 'id',
    sortable: true,
  },
  {
    fieldName: 'First Name',
    key: 'firstName',
    sortable: true,
  },
  {
    fieldName: 'Last Name',
    initialSort: true,
    key: 'lastName',
    sortable: true,
  },
  {
    fieldName: 'Email',
    key: 'email',
    sortable: true,
  },
  {
    fieldName: 'User Type',
    key: 'type',
    sortable: true,
  },
  {
    fieldName: 'Status',
    key: 'status',
    sortable: false,
  },
];

// only children of policies have a different schema
// so would be better to have a PermissionTable of some sort, the schema will always be the same
// only users and groups have permissions right now (applications will next)
// for some reason the old code has a child schema for Policy resource, not sure why
// const childSchema: Schema = [
//   { key: 'id', fieldName: 'ID', sortable: true, initialSort: true },
//   { key: 'name', fieldName: 'Name', sortable: true },
//   { key: 'mask', fieldName: 'Access Level', sortable: true },
//   { key: 'action', fieldName: 'Action', sortable: false },
// ];

// const mapTableData = (results) => {
//   return results.map((result) => ({
//     ...result,
//     action: 'remove',
//     actionText: 'REMOVE',
//   }));
// };

export default schema;

// TODO: saved for content panel fields
// panel "schema" can be handled in the content panel components
// {
//   fieldName: 'ID',
//   // immutable: true,
//   key: 'id',
//   // panelSection: 'id',
// },
// {
//   fieldName: 'First Name',
//   key: 'firstName',
//   // panelSection: null,
// },
// {
//   fieldName: 'Last Name',
//   initialSort: true,
//   key: 'lastName',
//   // panelSection: 'id',
// },
// {
//   fieldName: 'Email',
//   key: 'email',
//   // panelSection: 'id',
//   // required: true,
//   // immutable: true,
// },
// {
//   fieldName: 'User Type',
//   // fieldType: FieldType.DROPDOWN,
//   key: 'type',
//   // options: Object.values(UserType),
//   // panelSection: 'meta',
//   // required: true,
// },
// {
//   fieldName: 'Status',
//   // fieldType: FieldType.DROPDOWN,
//   key: 'status',
//   // options: Object.values(UserStatus),
//   // panelSection: 'meta',
// },
// {
// fieldName: 'Created',
// immutable: true,
// key: 'createdAt',
// panelSection: 'meta',
// },
// {
// fieldName: 'Last Login',
// hideOnTable: true,
// immutable: true,
// key: 'lastLogin',
// panelSection: 'meta',
// },
// {
//   fieldName: 'Language',
//   fieldType: FieldType.DROPDOWN,
//   key: 'preferredLanguage',
//   options: Object.values(UserLanguage),
//   panelSection: 'meta',
// },
