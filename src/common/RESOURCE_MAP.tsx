import {
  getGroups,
  getUsers,
  getApps,
  getApp,
  getUser,
  getGroup,
  addUserToApplication,
  addGroupToApplication,
  removeGroupFromApplication,
  updateUser,
  addGroupToUser,
  addApplicationToUser,
  removeApplicationFromUser,
  removeGroupFromUser,
  addApplicationToGroup,
  removeApplicationFromGroup,
  removeUserFromApplication,
  updateApplication,
  updateGroup,
} from 'services';

import GroupListItem from 'components/Groups/ListItem';
import UserListItem from 'components/Users/ListItem';
import AppListItem from 'components/Applications/ListItem';

type Schema = { key: string; value: string; sortable: boolean; initialSort: boolean }[];

export default {
  users: {
    schema: [
      { key: 'id', value: 'ID', sortable: true, immutable: true },
      { key: 'firstName', value: 'First Name', sortable: true },
      { key: 'lastName', value: 'Last Name', sortable: true, initialSort: true },
      { key: 'email', value: 'Email', sortable: true },
      { key: 'role', value: 'Role', sortable: true },
      { key: 'status', value: 'Status' },
      { key: 'createdAt', value: 'Date Created', sortable: true, immutable: true },
      { key: 'lastLogin', value: 'Last Login', sortable: true, immutable: true },
      { key: 'preferredLanguage', value: 'Preferred Language' },
    ] as Schema,
    name: 'users',
    ListItem: UserListItem,
    getList: getUsers,
    getItem: getUser,
    updateItem: updateUser,
    rowHeight: 50,
    initialSortOrder: 'DESC',
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
    schema: [
      { key: 'id', value: 'ID', sortable: true, immutable: true },
      { key: 'name', value: 'Name', sortable: true, initialSort: true },
      { key: 'description', value: 'Description', sortable: true },
      { key: 'status', value: 'Status', sortable: true },
    ] as Schema,
    name: 'groups',
    ListItem: GroupListItem,
    getList: getGroups,
    updateItem: updateGroup,
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
    schema: [
      { key: 'id', value: 'ID', sortable: true, immutable: true },
      { key: 'name', value: 'Name', sortable: true, initialSort: true },
      { key: 'clientId', value: 'Client ID', sortable: true },
      { key: 'description', value: 'Description', sortable: true },
      { key: 'status', value: 'Status', sortable: true },
    ] as Schema,
    name: 'apps',
    ListItem: AppListItem,
    getList: getApps,
    updateItem: updateApplication,
    getItem: getApp,
    rowHeight: 30,
    initialSortOrder: 'ASC',
    associatedTypes: ['groups', 'users'],
    add: {
      users: ({ users, item }) => addUserToApplication({ application: item, user: users }),
      groups: ({ groups, item }) => addGroupToApplication({ application: item, group: groups }),
    },
    remove: {
      users: ({ users, item }) => removeUserFromApplication({ application: item, user: users }),
      groups: ({ groups, item }) =>
        removeGroupFromApplication({ application: item, group: groups }),
    },
    get initialSortField() {
      return this.schema.find(field => field.initialSort);
    },
    get sortableFields() {
      return this.schema.filter(field => field.sortable);
    },
  },
};
