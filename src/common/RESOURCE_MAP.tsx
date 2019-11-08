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
      { fieldName: 'ID', immutable: true, key: 'id', panelSection: 1, sortable: true },
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
        panelSection: 1,
        required: true,
        sortable: true,
      },
      { fieldName: 'Email', key: 'email', panelSection: 1, required: true, sortable: true },
      {
        fieldName: 'User Type',
        fieldType: 'dropdown',
        key: 'type',
        options: ['ADMIN', 'USER'],
        panelSection: 2,
        required: true,
        sortable: true,
      },
      {
        fieldName: 'Status',
        fieldType: 'dropdown',
        key: 'status',
        options: STATUSES,
        panelSection: 2,
      },
      {
        fieldName: 'Created',
        immutable: true,
        key: 'createdAt',
        panelSection: 2,
        sortable: true,
      },
      {
        fieldName: 'Last Login',
        immutable: true,
        key: 'lastLogin',
        panelSection: 2,
        sortable: true,
      },
      {
        fieldName: 'Language',
        fieldType: 'dropdown',
        key: 'preferredLanguage',
        options: ['ENGLISH', 'FRENCH', 'SPANISH'],
        panelSection: 2,
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
      { key: 'id', fieldName: 'ID', sortable: true, immutable: true },
      { key: 'name', fieldName: 'Name', sortable: true, initialSort: true, required: true },
      { key: 'description', fieldName: 'Description', sortable: true },
      {
        fieldName: 'Status',
        fieldType: 'dropdown',
        key: 'status',
        options: STATUSES,
        sortable: true,
      },
    ],
    updateItem: updateGroup,
  },
  applications: {
    add: {
      users: ({ user, item }) => addApplicationToUser({ application: item, user }),
      groups: ({ group, item }) => addApplicationToGroup({ application: item, group }),
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
      { key: 'id', fieldName: 'ID', sortable: true, immutable: true },
      { key: 'name', fieldName: 'Name', sortable: true, initialSort: true, required: true },
      { key: 'description', fieldName: 'Description', sortable: true },
      {
        fieldName: 'Status',
        fieldType: 'dropdown',
        key: 'status',
        options: STATUSES,
        sortable: true,
      },
      {
        fieldName: 'Application Type',
        fieldType: 'dropdown',
        key: 'type',
        options: ['ADMIN', 'CLIENT'],
        sortable: true,
      },
      { key: 'clientId', fieldName: 'Client ID', required: true },
      { key: 'clientSecret', fieldName: 'Client Secret', required: true },
      { key: 'redirectUri', fieldName: 'Redirect Uri', required: true },
    ],
    updateItem: updateApplication,
  },
};

export default RESOURCE_MAP;
