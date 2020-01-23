import moment from 'moment';
import React from 'react';

import {
  addApplicationToGroup,
  addApplicationToUser,
  addGroupPermissionToPolicy,
  addGroupToUser,
  addUserPermissionToPolicy,
  createApplication,
  createGroup,
  createPolicy,
  createUser,
  deleteApplication,
  deleteGroup,
  deletePolicy,
  deleteUser,
  getApiKeys,
  getApp,
  getApps,
  getGroup,
  getGroups,
  getPolicies,
  getPolicy,
  getUser,
  getUserAndUserGroupPermissions,
  getUsers,
  removeApplicationFromGroup,
  removeApplicationFromUser,
  removeGroupFromUser,
  removeGroupPermissionFromPolicy,
  removeUserPermissionFromPolicy,
  revokeApiKey,
  updateApplication,
  updateGroup,
  updatePolicy,
  updateUser,
} from 'services';

import { DATE_FORMAT, STATUSES } from 'common/injectGlobals';
import { getApiKeyStatus } from 'components/Associator/apiKeysUtils';

import ApiKeysTable from 'components/Associator/ApiKeysTable';
import UserPermissionsTable from 'components/Associator/UserPermissionsTable';

import PermissionsTable from 'components/Associator/PermissionsTable';
import {
  PolicyListItem,
  ApiKeyListItem,
  ApplicationListItem,
  GroupListItem,
  PermissionListItem,
  UserListItem,
} from 'components/ListItem';

import { IResource, TResourceType } from 'common/typedefs/Resource';
import { Icon } from 'semantic-ui-react';

// ignore tslint sort, resources listed in deliberate order
const RESOURCE_MAP: { [key in TResourceType]: IResource } = {
  users: {
    add: {
      applications: ({ application, item }) => addApplicationToUser({ user: item, application }),
      groups: ({ group, item }) => addGroupToUser({ user: item, group }),
    },
    addItem: true,
    associatedTypes: ['groups', 'applications', 'permissions', 'API Keys'],
    AssociatorComponent: null,
    childSchema: [
      { key: 'id', fieldName: 'ID', sortable: true, initialSort: true },
      { key: 'name', fieldName: 'Name', sortable: true },
      { key: 'mask', fieldName: 'Access Level', sortable: true },
    ],
    createItem: createUser,
    deleteItem: deleteUser,
    emptyMessage: 'Please select a user',
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find(field => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter(field => field.sortable);
    },
    getItem: getUser,
    getKey: item => item.id.toString(),
    getList: getUsers,
    getListAll: getUsers,
    getName: x => `${x.lastName}, ${x.firstName ? x.firstName[0] : undefined}`, // Null safe property access
    Icon: ({ style }) => <Icon name="user" style={style} />,
    initialSortOrder: 'ASC',
    isParent: true,
    ListItem: UserListItem,
    mapTableData: results => results,
    name: { singular: 'user', plural: 'users' },
    noDelete: true,
    remove: {
      applications: ({ application, item }) =>
        removeApplicationFromUser({ user: item, application }),
      groups: ({ group, item }) => removeGroupFromUser({ user: item, group }),
    },
    rowHeight: 50,
    // TODO: need a specific schema for policies/users
    schema: [
      { fieldName: 'ID', immutable: true, key: 'id', panelSection: 'id', sortable: true },
      {
        fieldName: 'First Name',
        key: 'firstName',
        panelSection: null,
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Last Name',
        initialSort: true,
        key: 'lastName',
        panelSection: 'id',
        required: true,
        sortable: true,
      },
      { fieldName: 'Email', key: 'email', panelSection: 'id', required: true, sortable: true },
      {
        fieldName: 'User Type',
        fieldType: 'dropdown',
        key: 'type',
        options: ['ADMIN', 'USER'],
        panelSection: 'meta',
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Language',
        fieldType: 'dropdown',
        key: 'preferredLanguage',
        options: ['ENGLISH', 'FRENCH', 'SPANISH'],
        panelSection: null,
      },
      {
        fieldName: 'Status',
        fieldType: 'dropdown',
        key: 'status',
        options: STATUSES,
        panelSection: 'meta',
      },
      {
        fieldName: 'Created',
        immutable: true,
        key: 'createdAt',
        panelSection: 'meta',
        sortable: true,
      },
      {
        fieldName: 'Last Login',
        immutable: true,
        key: 'lastLogin',
        panelSection: 'meta',
        sortable: true,
      },
    ],
    updateItem: updateUser,
  },
  groups: {
    add: {
      applications: ({ application, item }) => addApplicationToGroup({ group: item, application }),
      users: ({ user, item }) => addGroupToUser({ group: item, user }),
    },
    addItem: true,
    associatedTypes: ['users', 'applications'],
    AssociatorComponent: null,
    childSchema: [
      { key: 'id', fieldName: 'ID', sortable: true, initialSort: true },
      { key: 'name', fieldName: 'Name', sortable: true },
      { key: 'mask', fieldName: 'Access Level', sortable: true },
    ],
    createItem: createGroup,
    deleteItem: deleteGroup,
    emptyMessage: 'Please select a group',
    // get initialSortField() {
    //   return this.schema.find(field => field.initialSort);
    // },
    // get sortableFields() {
    //   return this.schema.filter(field => field.sortable);
    // },
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find(field => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter(field => field.sortable);
    },
    getItem: getGroup,
    getKey: item => item.id.toString(),
    getList: getGroups,
    getListAll: getGroups,
    Icon: ({ style }) => <Icon name="group" style={style} />,
    initialSortOrder: 'ASC',
    isParent: true,
    ListItem: GroupListItem,
    mapTableData: results => results,
    name: { singular: 'group', plural: 'groups' },
    remove: {
      applications: ({ application, item }) =>
        removeApplicationFromGroup({ group: item, application }),
      users: ({ user, item }) => removeGroupFromUser({ group: item, user }),
    },
    rowHeight: 44,
    // TODO: need a specific schema for policies/groups
    schema: [
      { key: 'id', fieldName: 'ID', panelSection: 'id', sortable: true, immutable: true },
      {
        fieldName: 'Name',
        initialSort: true,
        key: 'name',
        panelSection: 'id',
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Status',
        fieldType: 'dropdown',
        key: 'status',
        options: STATUSES,
        panelSection: 'meta',
        sortable: true,
      },
      { key: 'description', fieldName: 'Description', panelSection: 'meta', sortable: true },
    ],
    updateItem: updateGroup,
  },
  applications: {
    add: {
      groups: ({ group, item }) => addApplicationToGroup({ application: item, group }),
      users: ({ user, item }) => addApplicationToUser({ application: item, user }),
    },
    addItem: true,
    associatedTypes: ['groups', 'users'],
    AssociatorComponent: null,
    childSchema: [],
    createItem: createApplication,
    deleteItem: deleteApplication,
    emptyMessage: 'Please select an application',
    // get initialSortField() {
    //   return this.schema.find(field => field.initialSort);
    // },
    // get sortableFields() {
    //   return this.schema.filter(field => field.sortable);
    // },
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find(field => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter(field => field.sortable);
    },
    getItem: getApp,
    getKey: item => item.id.toString(),
    getList: getApps,
    getListAll: getApps,
    Icon: ({ style }) => (
      <i
        className="icon"
        style={{
          background: `url("${require('assets/icons/layers-icon.svg')}") no-repeat`,
          height: '1.2em',
          marginTop: '0.2em',
          ...style,
        }}
      />
    ),
    initialSortOrder: 'ASC',
    isParent: true,
    ListItem: ApplicationListItem,
    mapTableData: results => results,
    name: { singular: 'application', plural: 'applications' },
    remove: {
      groups: ({ group, item }) => removeApplicationFromGroup({ application: item, group }),
      users: ({ user, item }) => removeApplicationFromUser({ application: item, user }),
    },
    rowHeight: 44,
    schema: [
      { key: 'id', fieldName: 'ID', panelSection: 'id', sortable: true, immutable: true },
      {
        fieldName: 'Name',
        initialSort: true,
        key: 'name',
        panelSection: 'id',
        required: true,
        sortable: true,
      },
      { key: 'description', fieldName: 'Description', panelSection: null, sortable: true },
      {
        fieldName: 'Status',
        fieldType: 'dropdown',
        key: 'status',
        options: STATUSES,
        panelSection: 'meta',
        sortable: true,
      },
      {
        fieldName: 'Application Type',
        fieldType: 'dropdown',
        key: 'type',
        options: ['ADMIN', 'CLIENT'],
        panelSection: 'meta',
        sortable: true,
      },
      { key: 'clientId', fieldName: 'Client ID', panelSection: 'meta', required: true },
      { key: 'clientSecret', fieldName: 'Client Secret', panelSection: 'meta', required: true },
      { key: 'redirectUri', fieldName: 'Redirect Uri', panelSection: 'meta', required: true },
    ],
    updateItem: updateApplication,
  },
'API Keys': {
    addItem: false,
    associatedTypes: [],
    AssociatorComponent: ApiKeysTable,
    deleteItem: item => revokeApiKey(item),
    emptyMessage: '',
    get initialSortField() {
      return this.schema.find(field => field.initialSort);
    },
    get sortableFields() {
      return this.schema.filter(field => field.sortable);
    },
    getKey: item => item.name,
    getList: getApiKeys,
    getListAll: getApiKeys,
    Icon: () => null,
    initialSortOrder: 'ASC',
    isParent: false,
    ListItem: ApiKeyListItem,
    mapTableData(results) {
      return results.map(result => ({
        ...result,
        action: this.deleteItem,
        actionText: 'REVOKE',
        expiryDate: moment(result.expiryDate).format(DATE_FORMAT),
        isRevoked: getApiKeyStatus(result),
        issueDate: moment(result.issueDate).format(DATE_FORMAT),
      }));
    },
    name: { singular: 'API Key', plural: 'API Keys' },
    rowHeight: 44,
    schema: [
      {
        fieldName: 'API Key',
        initialSort: true,
        key: 'name',
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Scope',
        key: 'scope',
        required: true,
        sortable: false,
      },
      {
        fieldName: 'Expiry',
        key: 'expiryDate',
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Issued',
        key: 'issueDate',
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Status',
        key: 'isRevoked',
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Action',
        key: 'action',
        required: false,
        sortable: false,
      },
    ],
  },
  permissions: {
    addItem: false,
    associatedTypes: [],
    AssociatorComponent: UserPermissionsTable,
    emptyMessage: '',
    get initialSortField() {
      return this.schema.find(field => field.initialSort);
    },
    get sortableFields() {
      return this.schema.filter(field => field.sortable);
    },
    getKey: item => item.id.toString(),
    getList: getUserAndUserGroupPermissions,
    getListAll: getPolicies,
    Icon: () => null,
    initialSortOrder: 'ASC',
    isParent: false,
    ListItem: PermissionListItem,
    name: { singular: 'permission', plural: 'permissions' },
    mapTableData(results) {
      return results.map(result => ({
        accessLevel: result.accessLevel,
        id: result.id,
        ownerType: result.ownerType,
        policy: result.policy.name,
      }));
    },
    rowHeight: 44,
    schema: [
      {
        fieldName: 'Policy Name',
        initialSort: true,
        key: 'policy',
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Access Level',
        key: 'accessLevel',
        options: ['READ', 'WRITE', 'DENY'],
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Inheritance',
        key: 'ownerType',
        required: true,
        sortable: true,
      },
    ],
  },
  policies: {
    add: {
      groups: ({ group, item }) => addGroupPermissionToPolicy({ policy: item, group }),
      users: ({ user, item }) => addUserPermissionToPolicy({ policy: item, user }),
    },
    associatedTypes: ['groups', 'users'],
    AssociatorComponent: PermissionsTable,
    childSchema: [
      { key: 'id', fieldName: 'ID', sortable: true, initialSort: true },
      { key: 'name', fieldName: 'Name', sortable: true },
      { key: 'mask', fieldName: 'Access Level', sortable: true },
    ],
    createItem: createPolicy,
    deleteItem: deletePolicy,
    emptyMessage: 'Please select a policy',
    // get initialSortField() {
    //   return this.schema.find(field => field.initialSort);
    // },
    // get sortableFields() {
    //   return this.schema.filter(field => field.sortable);
    // },
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find(field => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter(field => field.sortable);
    },
    getItem: getPolicy,
    getList: getPolicies,
    Icon: ({ style }) => (
      <i
        className="icon"
        style={{
          background: `url("${require('assets/icons/group-3.svg')}") no-repeat`,
          height: '1.2em',
          marginTop: '0.3em',
          ...style,
        }}
      />
    ),
    initialSortOrder: 'ASC',
    ListItem: PolicyListItem,
    name: { singular: 'policy', plural: 'policies' },
    remove: {
      groups: ({ group, item }) => removeGroupPermissionFromPolicy({ policy: item, group }),
      users: ({ user, item }) => removeUserPermissionFromPolicy({ policy: item, user }),
    },
    rowHeight: 44,
    schema: [
      {
        fieldName: 'ID',
        immutable: true,
        initialSort: true,
        key: 'id',
        panelSection: 'id',
        sortable: true,
      },
      { fieldName: 'Name', key: 'name', panelSection: 'id', required: true, sortable: true },
      { fieldName: '# Groups', key: 'groups' },
      { fieldName: '# Users', key: 'users' },
    ],
    updateItem: updatePolicy,
  },
};

export default RESOURCE_MAP;
