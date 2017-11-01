import {
  getGroups,
  getUsers,
  getApps,
  getUser,
  getUserGroups,
  getUserApplications,
  addApplicationToGroup,
  addApplicationToUser,
  removeApplicationFromUser,
  removeApplicationFromGroup,
  getGroupApplications,
  getGroupUsers,
  addGroupToUser,
  getGroup,
  removeGroupFromUser,
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
    getData: getUsers,
    rowHeight: 50,
    sortableFields: userSortFields,
    initialSortField: userSortFields.find(field => field.key === 'lastName'),
    initialSortOrder: 'DESC',
  },
  groups: {
    name: 'groups',
    ListItem: GroupListItem,
    getData: getGroups,
    rowHeight: 44,
    sortableFields: groupSortFields,
    initialSortField: groupSortFields.find(field => field.key === 'name'),
    initialSortOrder: 'ASC',
  },
  apps: {
    name: 'apps',
    ListItem: AppListItem,
    getData: getApps,
    rowHeight: 30,
    sortableFields: applicationSortFields,
    initialSortField: applicationSortFields.find(field => field.key === 'name'),
    initialSortOrder: 'ASC',
  },
};
