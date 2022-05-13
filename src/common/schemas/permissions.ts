import { Schema } from './types';

const schema: Schema = [
  {
    fieldName: 'Policy Name',
    initialSort: true,
    key: 'policy',
    sortable: true,
  },
  {
    fieldName: 'Access Level',
    key: 'accessLevel',
    sortable: true,
  },
  {
    fieldName: 'Inheritance',
    key: 'ownerType',
    sortable: true,
  },
  {
    fieldName: 'Action',
    key: 'action',
    sortable: false,
  },
];

const mapTableData = (results) => {
  return results.map((result) => {
    // when first loading the list, the previous entity (now the parent entity) is still in state,
    // so need to prevent loading the results until list state is updated. Need to do this because
    // permissions have a nested structure
    return result.policy
      ? {
          accessLevel: result.accessLevel,
          id: result.policy.id,
          ownerType: result.ownerType,
          policy: result.policy.name,
          action: 'remove',
          actionText: 'REMOVE',
        }
      : {};
  });
};

export default schema;

// childSchema: [],

// content panel fields, for PermissionTable
// {
//   fieldName: 'Policy Name',
//   initialSort: true,
//   key: 'policy',
//   required: true,
//   sortable: true,
// },
// {
//   fieldName: 'Access Level',
//   key: 'accessLevel',
//   options: ['READ', 'WRITE', 'DENY'],
//   required: true,
//   sortable: true,
// },
// {
//   fieldName: 'Inheritance',
//   key: 'ownerType',
//   required: true,
//   sortable: true,
// },
// {
//   fieldName: 'Action',
//   key: 'action',
//   required: false,
//   sortable: false,
// },
