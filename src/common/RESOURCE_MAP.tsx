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

type Schema = { key: string; value: string; sortable: boolean; initialSort: boolean }[];

export default {
  users: {
    schema: [
      { key: 'id', value: 'ID', sortable: true, immutable: true },
      { key: 'firstName', value: 'First Name', sortable: true, required: true },
      { key: 'lastName', value: 'Last Name', sortable: true, initialSort: true, required: true },
      { key: 'email', value: 'Email', sortable: true, required: true },
      { key: 'role', value: 'Role', sortable: true, required: true },
      { key: 'status', value: 'Status', immutable: true },
      { key: 'createdAt', value: 'Date Created', sortable: true, immutable: true },
      { key: 'lastLogin', value: 'Last Login', sortable: true, immutable: true },
      { key: 'preferredLanguage', value: 'Preferred Language' },
    ] as Schema,
    noDelete: true,
    name: 'users',
    ListItem: UserListItem,
    getList: getUsers,
    getItem: getUser,
    updateItem: updateUser,
    createItem: createUser,
    deleteItem: deleteUser,
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
      { key: 'name', value: 'Name', sortable: true, initialSort: true, required: true },
      { key: 'description', value: 'Description', sortable: true },
      { key: 'status', value: 'Status', sortable: true },
    ] as Schema,
    name: 'groups',
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
    schema: [
      { key: 'id', value: 'ID', sortable: true, immutable: true },
      { key: 'name', value: 'Name', sortable: true, initialSort: true, required: true },
      { key: 'description', value: 'Description', sortable: true },
      { key: 'status', value: 'Status', sortable: true },
      { key: 'clientId', value: 'Client ID', required: true },
      { key: 'clientSecret', value: 'Client Secret', required: true },
      { key: 'redirectUri', value: 'Redirect Uri', required: true },
    ] as Schema,
    name: 'apps',
    ListItem: AppListItem,
    getList: getApps,
    updateItem: updateApplication,
    createItem: createApplication,
    deleteItem: deleteApplication,
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
