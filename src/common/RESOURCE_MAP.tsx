import React from 'react';
import {
  getGroups,
  getUsers,
  getApps,
  getApp,
  getUser,
  getGroup,
  updateUser,
  addGroupToUser,
  addApplicationToUser,
  removeApplicationFromUser,
  removeGroupFromUser,
  addApplicationToGroup,
  removeApplicationFromGroup,
  updateApplication,
  updateGroup,
  createGroup,
  createUser,
  createApplication,
  deleteUser,
  deleteGroup,
  deleteApplication,
} from 'services';

import GroupListItem from 'components/Groups/ListItem';
import UserListItem from 'components/Users/ListItem';
import AppListItem from 'components/Applications/ListItem';
import { Icon } from 'semantic-ui-react';

type FieldType = 'dropdown' | 'text';
type Schema = {
  key: string;
  fieldName: string;
  sortable?: boolean;
  initialSort: boolean;
  fieldType: FieldType;
  options?: string[];
  required?: boolean;
}[];

export default {
  users: {
    Icon: ({ style }) => <Icon name="user" style={style} />,
    getName: x => `${x.lastName}, ${x.firstName[0]}`,
    emptyMessage: 'Please select a user',
    schema: [
      { key: 'id', fieldName: 'ID', sortable: true, immutable: true },
      { key: 'firstName', fieldName: 'First Name', sortable: true, required: true },
      {
        key: 'lastName',
        fieldName: 'Last Name',
        sortable: true,
        initialSort: true,
        required: true,
      },
      { key: 'email', fieldName: 'Email', sortable: true, required: true },
      {
        key: 'role',
        fieldName: 'Role',
        sortable: true,
        required: true,
        type: 'dropdown',
        options: ['Admin', 'User'],
      },
      {
        key: 'status',
        fieldName: 'Status',
        type: 'dropdown',
        options: ['Disabled', 'Approved', 'Pending'],
      },
      { key: 'createdAt', fieldName: 'Date Created', sortable: true, immutable: true },
      { key: 'lastLogin', fieldName: 'Last Login', sortable: true, immutable: true },
      {
        key: 'preferredLanguage',
        fieldName: 'Preferred Language',
        type: 'dropdown',
        options: ['English', 'Spanish'],
      },
    ] as Schema,
    noDelete: true,
    name: 'user',
    ListItem: UserListItem,
    getList: getUsers,
    getItem: getUser,
    updateItem: updateUser,
    createItem: createUser,
    deleteItem: deleteUser,
    rowHeight: 50,
    initialSortOrder: 'ASC',
    associatedTypes: ['groups', 'apps'],
    add: {
      groups: ({ groups, item }) => addGroupToUser({ user: item, group: groups }),
      apps: ({ apps, item }) => addApplicationToUser({ user: item, application: apps }),
    },
    remove: {
      groups: ({ groups, item }) => removeGroupFromUser({ user: item, group: groups }),
      apps: ({ apps, item }) => removeApplicationFromUser({ user: item, application: apps }),
    },
    get initialSortField() {
      return this.schema.find(field => field.initialSort);
    },
    get sortableFields() {
      return this.schema.filter(field => field.sortable);
    },
  },
  groups: {
    Icon: ({ style }) => <Icon name="group" style={style} />,
    emptyMessage: 'Please select a group',
    schema: [
      { key: 'id', fieldName: 'ID', sortable: true, immutable: true },
      { key: 'name', fieldName: 'Name', sortable: true, initialSort: true, required: true },
      { key: 'description', fieldName: 'Description', sortable: true },
      {
        key: 'status',
        fieldName: 'Status',
        sortable: true,
        type: 'dropdown',
        options: ['Disabled', 'Approved', 'Pending'],
      },
    ] as Schema,
    name: 'group',
    ListItem: GroupListItem,
    getList: getGroups,
    updateItem: updateGroup,
    createItem: createGroup,
    deleteItem: deleteGroup,
    getItem: getGroup,
    rowHeight: 44,
    initialSortOrder: 'ASC',
    associatedTypes: ['users', 'apps'],
    add: {
      users: ({ users, item }) => addGroupToUser({ group: item, user: users }),
      apps: ({ apps, item }) => addApplicationToGroup({ group: item, application: apps }),
    },
    remove: {
      users: ({ users, item }) => removeGroupFromUser({ group: item, user: users }),
      apps: ({ apps, item }) => removeApplicationFromGroup({ group: item, application: apps }),
    },
    get initialSortField() {
      return this.schema.find(field => field.initialSort);
    },
    get sortableFields() {
      return this.schema.filter(field => field.sortable);
    },
  },
  apps: {
    Icon: ({ style }) => (
      <i
        className="icon"
        style={{
          background: `url("${require('assets/icons/layers-icon.svg')}") no-repeat`,
          marginTop: '0.2em',
          ...style,
        }}
      />
    ),
    emptyMessage: 'Please select an application',
    schema: [
      { key: 'id', fieldName: 'ID', sortable: true, immutable: true },
      { key: 'name', fieldName: 'Name', sortable: true, initialSort: true, required: true },
      { key: 'description', fieldName: 'Description', sortable: true },
      {
        key: 'status',
        fieldName: 'Status',
        sortable: true,
        type: 'dropdown',
        options: ['Disabled', 'Approved', 'Pending'],
      },
      { key: 'clientId', fieldName: 'Client ID', required: true },
      { key: 'clientSecret', fieldName: 'Client Secret', required: true },
      { key: 'redirectUri', fieldName: 'Redirect Uri', required: true },
    ] as Schema,
    name: 'application',
    ListItem: AppListItem,
    getList: getApps,
    updateItem: updateApplication,
    createItem: createApplication,
    deleteItem: deleteApplication,
    getItem: getApp,
    rowHeight: 44,
    initialSortOrder: 'ASC',
    associatedTypes: ['groups', 'users'],
    add: {
      users: ({ users, item }) => addApplicationToUser({ application: item, user: users }),
      groups: ({ groups, item }) => addApplicationToGroup({ application: item, group: groups }),
    },
    remove: {
      users: ({ users, item }) => removeApplicationFromUser({ application: item, user: users }),
      groups: ({ groups, item }) =>
        removeApplicationFromGroup({ application: item, group: groups }),
    },
    get initialSortField() {
      return this.schema.find(field => field.initialSort);
    },
    get sortableFields() {
      return this.schema.filter(field => field.sortable);
    },
  },
};
