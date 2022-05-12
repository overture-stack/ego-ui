import { Application, Entity, Group, Policy, User } from 'common/typedefs';
import { MaskLevel, Permission } from 'common/typedefs/Permission';
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
import { GroupWithMask, PolicyWithMask } from 'services/types';

interface GroupResourceInterface {
  createItem: ({ item }: { item: Partial<Group> }) => Promise<Group>;
  deleteItem: ({ item }: { item: Group }) => Promise<string>;
  updateItem: ({ item }: { item: Group }) => Promise<Group>;
  getList: (params: IListParams) => Promise<IListResponse>;
  // TODO: implement without parent resource type, that's already known. See applicationResource for sample type def
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
    permissions: ({
      permission,
      item,
    }: {
      permission: PolicyWithMask;
      item: GroupWithMask;
    }) => Promise<Policy>;
    // TODO: create service call to add users to a group. This call adds a group to a user one by one, so that in the ui, if several
    // users are added to a group, there is an api call for each addition
    // typing will be: ({ users, entity }: { user: User[]; entity: Group }) => Promise<Group>;
    // ticket: https://github.com/overture-stack/ego-ui/issues/204
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
    permissions: ({
      permission,
      item,
    }: {
      permission: Policy;
      item: GroupWithMask;
    }) => Promise<string>;
    // TODO: same as with add users above
    // typing will be: ({ users, entity }: { user: User[]; entity: Group }) => Promise<Group>;
    users: ({ user, item }: { user: User; item: Group }) => Promise<User>;
  };
  getItem: (id: string) => Promise<User>;
}

const GroupResource: GroupResourceInterface = {
  createItem: createGroup,
  deleteItem: deleteGroup,
  getItem: getGroup,
  getList: getGroups,
  updateItem: updateGroup,
  add: {
    applications: ({ application, item }) => addApplicationToGroup({ entity: item, application }),
    permissions: ({ permission, item }) =>
      addGroupPermissionToPolicy({
        group: { ...item, mask: permission.mask },
        policy: permission,
      }),
    users: ({ entity, item }) => addGroupToUser({ group: item, entity }),
  },
  remove: {
    applications: ({ application, item }) =>
      removeApplicationFromGroup({ entity: item, application }),
    permissions: ({ permission, item }) =>
      removeGroupPermissionFromPolicy({ group: item, policy: permission }),
    users: ({ user, item }) => removeGroupFromUser({ group: item, entity: user }),
  },
};

export default GroupResource;
