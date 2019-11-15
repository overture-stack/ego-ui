import React from 'react';
import {
  addApplicationToGroup,
  addApplicationToUser,
  addGroupToUser,
  createApplication,
  createGroup,
  createUser,
  deleteApplication,
  deleteGroup,
  deleteUser,
  getApp,
  getApps,
  getGroup,
  getGroups,
  getUser,
  getUsers,
  removeApplicationFromGroup,
  removeApplicationFromUser,
  removeGroupFromUser,
  updateApplication,
  updateGroup,
  updateUser,
} from 'services';

import { STATUSES } from 'common/injectGlobals';

import { ApplicationListItem, GroupListItem, UserListItem } from 'components/ListItem';

import { IResource, TResourceType } from 'common/typedefs/Resource';
import { Icon } from 'semantic-ui-react';

// ignore tslint sort, resources listed in deliberate order
const RESOURCE_MAP: { [key in TResourceType]: IResource } = {
  users: {
    add: {
      applications: ({ application, item }) => addApplicationToUser({ user: item, application }),
      groups: ({ group, item }) => addGroupToUser({ user: item, group }),
    },
    associatedTypes: ['groups', 'applications'],
    createItem: createUser,
    deleteItem: deleteUser,
    emptyMessage: 'Please select a user',
    get initialSortField() {
      return this.schema.find(field => field.initialSort);
    },
    get sortableFields() {
      return this.schema.filter(field => field.sortable);
    },
    getItem: getUser,
    getList: getUsers,
    getName: x => `${x.lastName}, ${x.firstName ? x.firstName[0] : undefined}`, // Null safe property access
    Icon: ({ style }) => <Icon name="user" style={style} />,
    initialSortOrder: 'ASC',
    ListItem: UserListItem,
    name: { singular: 'user', plural: 'users' },
    noDelete: true,
    remove: {
      applications: ({ application, item }) =>
        removeApplicationFromUser({ user: item, application }),
      groups: ({ group, item }) => removeGroupFromUser({ user: item, group }),
    },
    rowHeight: 50,
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
    associatedTypes: ['users', 'applications'],
    createItem: createGroup,
    deleteItem: deleteGroup,
    emptyMessage: 'Please select a group',
    get initialSortField() {
      return this.schema.find(field => field.initialSort);
    },
    get sortableFields() {
      return this.schema.filter(field => field.sortable);
    },
    getItem: getGroup,
    getList: getGroups,
    Icon: ({ style }) => <Icon name="group" style={style} />,
    initialSortOrder: 'ASC',
    ListItem: GroupListItem,
    name: { singular: 'group', plural: 'groups' },
    remove: {
      applications: ({ application, item }) =>
        removeApplicationFromGroup({ group: item, application }),
      users: ({ user, item }) => removeGroupFromUser({ group: item, user }),
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
    associatedTypes: ['groups', 'users'],
    createItem: createApplication,
    deleteItem: deleteApplication,
    emptyMessage: 'Please select an application',
    get initialSortField() {
      return this.schema.find(field => field.initialSort);
    },
    get sortableFields() {
      return this.schema.filter(field => field.sortable);
    },
    getItem: getApp,
    getList: getApps,
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
    ListItem: ApplicationListItem,
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
};

export default RESOURCE_MAP;
