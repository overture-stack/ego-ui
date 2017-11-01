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

const userSortFields = [
  { key: 'id', value: 'ID' },
  { key: 'email', value: 'Email' },
  { key: 'role', value: 'Role' },
  { key: 'firstName', value: 'First Name' },
  { key: 'lastName', value: 'Last Name' },
  { key: 'createdAt', value: 'Date Created' },
  { key: 'lastLogin', value: 'Last Login' },
];

const groupSortFields = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Name' },
  { key: 'description', value: 'Description' },
  { key: 'status', value: 'Status' },
];

const applicationSortFields = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Name' },
  { key: 'clientId', value: 'Client ID' },
  { key: 'description', value: 'Description' },
  { key: 'status', value: 'Status' },
];

export default {
  users: {
    name: 'users',
    ListItem: UserListItem,
    getList: getUsers,
    getItem: getUser,
    updateItem: updateUser,
    rowHeight: 50,
    sortableFields: userSortFields,
    initialSortField: userSortFields.find(field => field.key === 'lastName'),
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
  },
  groups: {
    name: 'groups',
    ListItem: GroupListItem,
    getList: getGroups,
    updateItem: updateGroup,
    getItem: getGroup,
    rowHeight: 44,
    sortableFields: groupSortFields,
    initialSortField: groupSortFields.find(field => field.key === 'name'),
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
  },
  apps: {
    name: 'apps',
    ListItem: AppListItem,
    getList: getApps,
    updateItem: updateApplication,
    getItem: getApp,
    rowHeight: 30,
    sortableFields: applicationSortFields,
    initialSortField: applicationSortFields.find(field => field.key === 'name'),
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
  },
};
