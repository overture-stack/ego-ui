import { get } from 'lodash';
import moment from 'moment';
import React from 'react';

import {
  addApplicationToGroup,
  addApplicationToUser,
  addGroupPermissionToPolicy,
  addGroupToUser,
  addUserPermissionToPolicy,
  addVisaPermissionToPolicy,
  createApplication,
  createGroup,
  createPolicy,
  createVisa,
  deleteApplication,
  deleteGroup,
  deletePolicy,
  deleteUser,
  deleteVisa,
  getApiKeys,
  getApp,
  getApps,
  getGroup,
  getGroupPermissions,
  getGroups,
  getPolicies,
  getPolicy,
  getUser,
  getUserAndUserGroupPermissions,
  getVisaPermissions,
  getUsers,
  getVisa,
  getVisas,
  removeApplicationFromGroup,
  removeApplicationFromUser,
  removeGroupFromUser,
  removeGroupPermissionFromPolicy,
  removeUserPermissionFromPolicy,
  removeVisaFromPolicy,
  revokeApiKey,
  updateApplication,
  updateGroup,
  updatePolicy,
  updateUser,
  updateVisa,
} from 'services';

import { DATE_FORMAT, STATUSES } from 'common/injectGlobals';
import { getApiKeyStatus } from 'components/Associator/apiKeysUtils';

import ApiKeysTable from 'components/Associator/ApiKeysTable';
import UserPermissionsTable from 'components/Associator/UserPermissionsTable';

import PermissionsTable from 'components/Associator/PermissionsTable';
import {
  ApiKeyListItem,
  ApplicationListItem,
  GroupListItem,
  PermissionListItem,
  PolicyListItem,
  UserListItem,
  VisaListItem,
} from 'components/ListItem';

import { IResource, TResourceType } from 'common/typedefs/Resource';
import { Icon } from 'semantic-ui-react';

import {
  API_KEYS,
  APPLICATION,
  APPLICATIONS,
  GROUP,
  GROUPS,
  PERMISSION,
  PERMISSIONS,
  POLICIES,
  POLICY,
  USER,
  USERS,
  VISAS,
  VISA
} from 'common/enums';
import { getUserDisplayName } from './getUserDisplayName';
import ApplicationIcon from 'components/Icons/application';
import PolicyIcon from 'components/Icons/policy';

// ignore tslint sort, resources listed in deliberate order
const RESOURCE_MAP: { [key in TResourceType]: IResource } = {
  users: {
    add: {
      applications: ({ application, item }) => addApplicationToUser({ user: item, application }),
      groups: ({ group, item }) => addGroupToUser({ user: item, group }),
    },
    addItem: true,
    associatedTypes: [GROUPS, APPLICATIONS, PERMISSIONS, API_KEYS],
    AssociatorComponent: null,
    childSchema: [
      { key: 'id', fieldName: 'ID', sortable: true, initialSort: true },
      { key: 'name', fieldName: 'Name', sortable: true },
      { key: 'mask', fieldName: 'Access Level', sortable: true },
      { key: 'action', fieldName: 'Action', sortable: false },
    ],
    deleteItem: deleteUser,
    emptyMessage: 'Please select a user',
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find((field) => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter((field) => field.sortable);
    },
    getItem: getUser,
    getKey: (item) => item.id.toString(),
    getList: getUsers,
    getListAll: getUsers,
    getName: getUserDisplayName,
    Icon: ({ style }) => <Icon name="user" style={style} />,
    initialSortOrder: 'ASC',
    isParent: true,
    ListItem: UserListItem,
    mapTableData(results) {
      return results.map((result) => ({
        ...result,
        action: 'remove',
        actionText: 'REMOVE',
      }));
    },
    name: { singular: USER, plural: USERS },
    noDelete: true,
    remove: {
      applications: ({ application, item }) =>
        removeApplicationFromUser({ user: item, application }),
      groups: ({ group, item }) => removeGroupFromUser({ user: item, group }),
    },
    rowHeight: 50,
    schema: [
      {
        fieldName: 'ID',
        immutable: true,
        key: 'id',
        panelSection: 'id',
        sortable: true,
      },
      {
        fieldName: 'First Name',
        key: 'firstName',
        panelSection: null,
        sortable: true,
      },
      {
        fieldName: 'Last Name',
        initialSort: true,
        key: 'lastName',
        panelSection: 'id',
        sortable: true,
      },
      {
        fieldName: 'Email',
        key: 'email',
        panelSection: 'id',
        required: true,
        sortable: true,
        immutable: true,
      },
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
        fieldName: 'Status',
        fieldType: 'dropdown',
        key: 'status',
        options: STATUSES,
        panelSection: 'meta',
      },
      {
        fieldName: 'Created',
        hideOnTable: true,
        immutable: true,
        key: 'createdAt',
        panelSection: 'meta',
        sortable: true,
      },
      {
        fieldName: 'Last Login',
        hideOnTable: true,
        immutable: true,
        key: 'lastLogin',
        panelSection: 'meta',
        sortable: true,
      },
      {
        fieldName: 'Language',
        fieldType: 'dropdown',
        hideOnTable: true,
        key: 'preferredLanguage',
        options: ['ENGLISH', 'FRENCH', 'SPANISH'],
        panelSection: 'meta',
      },
      {
        fieldName: 'Action',
        key: 'action',
        sortable: false,
      },
    ],
    updateItem: updateUser,
  },
  groups: {
    add: {
      applications: ({ application, item }) => addApplicationToGroup({ group: item, application }),
      permissions: ({ permission, item }) =>
        addGroupPermissionToPolicy({
          group: { ...item, mask: permission.mask },
          policy: permission,
        }),
      users: ({ user, item }) => addGroupToUser({ group: item, user }),
    },
    addItem: true,
    associatedTypes: [USERS, APPLICATIONS, PERMISSIONS],
    AssociatorComponent: null,
    childSchema: [
      { key: 'id', fieldName: 'ID', sortable: true, initialSort: true },
      { key: 'name', fieldName: 'Name', sortable: true },
      { key: 'mask', fieldName: 'Access Level', sortable: true },
      { fieldName: 'Action', key: 'action', sortable: false },
    ],
    createItem: createGroup,
    deleteItem: deleteGroup,
    emptyMessage: 'Please select a group',
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find((field) => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter((field) => field.sortable);
    },
    getItem: getGroup,
    getKey: (item) => item.id.toString(),
    getList: getGroups,
    getListAll: getGroups,
    getName: (item) => get(item, 'name'),
    Icon: ({ style }) => <Icon name="group" style={style} />,
    initialSortOrder: 'ASC',
    isParent: true,
    ListItem: GroupListItem,
    mapTableData(results) {
      return results.map((result) => ({
        ...result,
        action: 'remove',
        actionText: 'REMOVE',
      }));
    },
    name: { singular: GROUP, plural: GROUPS },
    remove: {
      applications: ({ application, item }) =>
        removeApplicationFromGroup({ group: item, application }),
      permissions: ({ permission, item }) =>
        removeGroupPermissionFromPolicy({ group: item, policy: permission }),
      users: ({ user, item }) => removeGroupFromUser({ group: item, user }),
    },
    rowHeight: 44,
    schema: [
      {
        fieldName: 'ID',
        immutable: true,
        key: 'id',
        panelSection: 'id',
        sortable: true,
      },
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
        required: true,
      },
      {
        fieldName: 'Description',
        key: 'description',
        panelSection: 'meta',
        sortable: true,
      },
      { fieldName: 'Action', key: 'action', sortable: false },
    ],
    updateItem: updateGroup,
  },
  applications: {
    add: {
      groups: ({ group, item }) => addApplicationToGroup({ application: item, group }),
      users: ({ user, item }) => addApplicationToUser({ application: item, user }),
    },
    addItem: true,
    associatedTypes: [GROUPS, USERS],
    AssociatorComponent: null,
    childSchema: [],
    createItem: createApplication,
    deleteItem: deleteApplication,
    emptyMessage: 'Please select an application',
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find((field) => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter((field) => field.sortable);
    },
    getItem: getApp,
    getKey: (item) => item.id.toString(),
    getList: getApps,
    getListAll: getApps,
    getName: (item) => get(item, 'name'),
    Icon: ({ style }) => <ApplicationIcon style={style} />,
    initialSortOrder: 'ASC',
    isParent: true,
    ListItem: ApplicationListItem,
    mapTableData: (results) => results,
    name: { singular: APPLICATION, plural: APPLICATIONS },
    remove: {
      groups: ({ group, item }) => removeApplicationFromGroup({ application: item, group }),
      users: ({ user, item }) => removeApplicationFromUser({ application: item, user }),
    },
    rowHeight: 44,
    schema: [
      {
        fieldName: 'ID',
        immutable: true,
        key: 'id',
        panelSection: 'id',
        sortable: true,
      },
      {
        fieldName: 'Name',
        initialSort: true,
        key: 'name',
        panelSection: 'id',
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Description',
        key: 'description',
        panelSection: null,
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
      {
        fieldName: 'Application Type',
        fieldType: 'dropdown',
        key: 'type',
        options: ['ADMIN', 'CLIENT'],
        panelSection: 'meta',
        sortable: true,
      },
      {
        fieldName: 'Client ID',
        key: 'clientId',
        panelSection: 'meta',
        required: true,
      },
      {
        fieldName: 'Client Secret',
        key: 'clientSecret',
        panelSection: 'meta',
        required: true,
      },
      {
        fieldName: 'Redirect Uri',
        key: 'redirectUri',
        panelSection: 'meta',
        required: true,
      },
      {
        fieldName: 'Error Redirect Uri',
        key: 'errorRedirectUri',
        panelSection: 'meta',
        required: true,
      },
    ],
    updateItem: updateApplication,
  },
  'API Keys': {
    addItem: false,
    associatedTypes: [],
    AssociatorComponent: ApiKeysTable,
    childSchema: [],
    deleteItem: (item) => revokeApiKey(item),
    emptyMessage: '',
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find((field) => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter((field) => field.sortable);
    },
    getKey: (item) => item.name,
    getList: getApiKeys,
    getListAll: getApiKeys,
    getName: (item) => get(item, 'name'),
    Icon: () => null,
    initialSortOrder: 'ASC',
    isParent: false,
    ListItem: ApiKeyListItem,
    mapTableData(results) {
      return results.map((result) => ({
        ...result,
        action: this.deleteItem,
        actionText: 'REVOKE',
        expiryDate: moment(result.expiryDate).format(DATE_FORMAT),
        isRevoked: getApiKeyStatus(result),
        issueDate: moment(result.issueDate).format(DATE_FORMAT),
      }));
    },
    name: { singular: 'API Key', plural: API_KEYS },
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
    addItem: {
      groups: true,
      users: false,
      visas: true,
    },
    associatedTypes: [],
    AssociatorComponent: {
      groups: PermissionsTable,
      users: UserPermissionsTable,
      visas: PermissionsTable,
    },
    childSchema: [],
    emptyMessage: '',
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find((field) => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter((field) => field.sortable);
    },
    getKey: (item) => item.id.toString(),
    getList: {
      groups: getGroupPermissions,
      users: getUserAndUserGroupPermissions,
      visas: getVisaPermissions,
    },
    getListAll: getPolicies,
    getName: (item) => get(item, 'name'),
    Icon: () => null,
    initialSortOrder: 'ASC',
    isParent: false,
    ListItem: PermissionListItem,
    name: { singular: PERMISSION, plural: PERMISSIONS },
    mapTableData(results) {
      return results.map((result) => ({
        accessLevel: result.accessLevel,
        id: result.policy.id,
        ownerType: result.ownerType,
        policy: result.policy.name,
        action: 'remove',
        actionText: 'REMOVE',
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
      {
        fieldName: 'Action',
        key: 'action',
        required: false,
        sortable: false,
      },
    ],
  },
  policies: {
    add: {
      groups: ({ group, item }) => addGroupPermissionToPolicy({ policy: item, group }),
      users: ({ user, item }) => addUserPermissionToPolicy({ policy: item, user }),
    },
    addItem: false,
    associatedTypes: [GROUPS, USERS],
    AssociatorComponent: PermissionsTable,
    childSchema: [
      { key: 'id', fieldName: 'ID', sortable: true, initialSort: true },
      { key: 'name', fieldName: 'Name', sortable: true },
      { key: 'mask', fieldName: 'Access Level', sortable: true },
      { fieldName: 'Action', key: 'action', sortable: false },
    ],
    createItem: createPolicy,
    deleteItem: deletePolicy,
    emptyMessage: 'Please select a policy',
    getKey: (item) => item.id.toString(),
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find((field) => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter((field) => field.sortable);
    },
    getItem: getPolicy,
    getList: getPolicies,
    getListAll: getPolicies,
    getName: (item) => get(item, 'name'),
    Icon: ({ style }) => <PolicyIcon style={style} />,
    initialSortOrder: 'ASC',
    isParent: true,
    ListItem: PolicyListItem,
    mapTableData: (results) => results,
    name: { singular: POLICY, plural: POLICIES },
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
      {
        fieldName: 'Name',
        key: 'name',
        panelSection: 'id',
        required: true,
        sortable: true,
      },
    ],
    updateItem: updatePolicy,
  },
  visas: {
    add: {
      permissions: ({ permission, item }) => 
        addVisaPermissionToPolicy({
          visa: { ...item, mask: permission.mask },
          policy: permission,
        }),
    },
    addItem: true,
    associatedTypes: [PERMISSIONS],
    AssociatorComponent: null,
    childSchema: [
      { key: 'id', fieldName: 'ID', sortable: true, initialSort: true },
      { key: 'type', fieldName: 'Type', sortable: true },
      { key: 'source', fieldName: 'Source', sortable: true },
      { fieldName: 'Value', key: 'value', sortable: true },
    ],
    createItem: createVisa,
    deleteItem: deleteVisa,
    emptyMessage: 'Please select a visa',
    initialSortField(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).find((field) => field.initialSort);
    },
    sortableFields(isChildOfPolicy: boolean) {
      return (isChildOfPolicy ? this.childSchema : this.schema).filter((field) => field.sortable);
    },
    getItem: getVisa,
    getKey: (item) => item.id.toString(),
    getList: getVisas,
    getListAll: getVisas,
    getName: (item) => get(item, 'name'),
    Icon: ({ style }) => <Icon name="address card" style={style} />,
    initialSortOrder: 'ASC',
    isParent: true,
    ListItem: VisaListItem,
    mapTableData(results) {
      return results.map((result) => ({
        ...result,
        action: 'remove',
        actionText: 'REMOVE',
      }));
    },
    name: { singular: VISA, plural: VISAS },
    remove: {
      permissions: ({ permission, item }) =>
        removeVisaFromPolicy({ visa: item, policy: permission }),
    },
    rowHeight: 44,
    schema: [
      {
        fieldName: 'ID',
        immutable: true,
        key: 'id',
        panelSection: 'id',
        sortable: true,
      },
      {
        fieldName: 'Type',
        initialSort: true,
        key: 'type',
        panelSection: 'id',
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Source',
        key: 'source',
        panelSection: 'meta',
        required: false,
        sortable: true,
      },
      {
        fieldName: 'Value',
        key: 'value',
        panelSection: 'meta',
        required: true,
        sortable: true,
      },
      {
        fieldName: 'By',
        key: 'by',
        panelSection: 'meta',
        required: true,
        sortable: true,
      },
      { fieldName: 'Action', key: 'action', sortable: false },
    ],
    updateItem: updateVisa,
  },
};

export default RESOURCE_MAP;
