import { Application, Group, User } from 'common/typedefs';
import {
  addApplicationToUser,
  addGroupToUser,
  getUser,
  getUsers,
  removeApplicationFromUser,
  removeGroupFromUser,
  updateUser,
} from 'services';
import { IListParams, IListResponse } from '../typedefs/Resource';

interface UserResourceInterface {
  updateItem: ({ item }: { item: User }) => Promise<User>;
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
      item: User;
    }) => Promise<User>;
    groups: ({ group, item }: { group: Group; item: User }) => Promise<User>;
  };
  remove: {
    applications: ({
      application,
      item,
    }: {
      application: Application;
      item: User;
    }) => Promise<User>;
    groups: ({ group, item }: { group: Group; item: User }) => Promise<User>;
  };
  getItem: (id: string) => Promise<User>;
}

const UserResource: UserResourceInterface = {
  getItem: getUser,
  add: {
    applications: ({ application, item }) => addApplicationToUser({ entity: item, application }),
    groups: ({ group, item }) => addGroupToUser({ entity: item, group }),
  },
  remove: {
    applications: ({ application, item }) =>
      removeApplicationFromUser({ entity: item, application }),
    groups: ({ group, item }) => removeGroupFromUser({ entity: item, group }),
  },
  updateItem: updateUser,
  getList: getUsers,
  // getChildList: getUsers
};

export default UserResource;

// Icon: ({ style }) => <Icon name="user" style={style} />,
// rowHeight: 50,
// emptyMessage: 'Please select a user',
// name: { singular: USER, plural: USERS },
// initialSortOrder: 'ASC',
// isParent: true,
// noDelete: true,
// ListItem: UserListItem,
// associatedTypes: [GROUPS, APPLICATIONS, PERMISSIONS, API_KEYS],
// getListAll: getUsers,
// getName: getUserDisplayName,
// addItem: true,
// getKey: (item) => item.id.toString(),
// AssociatorComponent: null,
