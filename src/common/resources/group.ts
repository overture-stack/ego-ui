import { Application, Entity, Group, User } from 'common/typedefs';
import { IListParams, IListResponse } from 'common/typedefs/Resource';
import {
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  updateGroup,
  addApplicationToGroup,
  addGroupPermissionToPolicy,
  addGroupToUser,
  removeApplicationFromGroup,
  removeGroupPermissionFromPolicy,
  removeGroupFromUser,
} from 'services';

interface GroupResourceInterface {
  createItem: ({ item }: { item: Partial<Group> }) => Promise<Group>;
  deleteItem: ({ item }: { item: Group }) => Promise<string>;
  updateItem: ({ item }: { item: Group }) => Promise<Group>;
  getList: (params: IListParams) => Promise<IListResponse>;
  getChildList?: (
    resourceType: string,
    childResourceType: string,
    id: string,
  ) => Promise<IListResponse>;
  add: {
    applications: ({
      application,
      item,
    }: {
      application: Application;
      item: Group;
    }) => Promise<Group>;
    // TODO: typing
    permissions: any;
    // TODO: create service call to add users TO a group. This call adds a group to a user one by one, so that in the ui, if several
    // users are added to a group, there is an api call for each addition
    // typing will be: ({ users, entity }: { user: User[]; entity: Group }) => Promise<Group>;
    users: ({ entity, item }: { entity: User; item: Group }) => Promise<User>;
  };
  remove: {
    applications: ({
      application,
      item,
    }: {
      application: Application;
      item: Group;
    }) => Promise<Group>;
    // TODO: typing
    permissions: any;
    // TODO: same as with add users above
    // typing will be: ({ users, entity }: { user: User[]; entity: Group }) => Promise<Group>;
    users: ({ user, item }: { user: User; item: Group }) => Promise<User>;
  };
  // entity provider
  getItem: (id: string) => Promise<User>;
}

const GroupResource: GroupResourceInterface = {
  createItem: createGroup,
  deleteItem: deleteGroup,
  getItem: getGroup,
  getList: getGroups,
  updateItem: updateGroup,
  add: {
    applications: ({ application, item }) => addApplicationToGroup({ group: item, application }),
    permissions: ({ permission, item }) =>
      addGroupPermissionToPolicy({
        group: { ...item, mask: permission.mask },
        policy: permission,
      }),
    users: ({ entity, item }) => addGroupToUser({ group: item, entity }),
  },
  remove: {
    applications: ({ application, item }) =>
      removeApplicationFromGroup({ group: item, application }),
    permissions: ({ permission, item }) =>
      removeGroupPermissionFromPolicy({ group: item, policy: permission }),
    users: ({ user, item }) => removeGroupFromUser({ group: item, entity: user }),
  },
};

export default GroupResource;
// TO REMOVE
// addItem: true,
// associatedTypes: [USERS, APPLICATIONS, PERMISSIONS],
// AssociatorComponent: null,
// rowHeight: 44,
// name: { singular: GROUP, plural: GROUPS },
// isParent: true,
// getName: (item) => get(item, 'name'),
// Icon: ({ style }) => <Icon name="group" style={style} />,
// ListItem: GroupListItem,
// getKey: (item) => item.id.toString(),
// initialSortOrder: 'ASC',
// emptyMessage: 'Please select a group',
// getListAll: getGroups,
