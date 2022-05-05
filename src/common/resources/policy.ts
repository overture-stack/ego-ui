import { Application, Group, Policy, User } from 'common/typedefs';
import { IListParams, IListResponse } from 'common/typedefs/Resource';
import {
  createPolicy,
  deletePolicy,
  getPolicy,
  getPolicies,
  updatePolicy,
  addGroupPermissionToPolicy,
  addUserPermissionToPolicy,
  removeGroupPermissionFromPolicy,
  removeUserPermissionFromPolicy,
  GroupWithMask,
  UserWithMask,
} from 'services';

interface PolicyResourceInterface {
  createItem: ({ item }: { item: Partial<Policy> }) => Promise<Policy>;
  deleteItem: ({ item }: { item: Policy }) => Promise<string>;
  updateItem: ({ item }: { item: Policy }) => Promise<Policy>;
  getList: (params: IListParams) => Promise<IListResponse>;
  getChildList?: (
    resourceType: string,
    childResourceType: string,
    id: string,
  ) => Promise<IListResponse>;
  add: {
    groups: ({ group, item }: { group: GroupWithMask; item: Policy }) => Promise<Policy>;
    users: ({ user, item }: { user: UserWithMask; item: Policy }) => Promise<Policy>;
  };
  remove: {
    groups: ({ group, item }: { group: Group; item: Policy }) => Promise<string>;
    users: ({ user, item }: { user: User; item: Policy }) => Promise<string>;
  };
  getItem: (id: string) => Promise<User>;
}

const PolicyResource: PolicyResourceInterface = {
  createItem: createPolicy,
  deleteItem: deletePolicy,
  getItem: getPolicy,
  getList: getPolicies,
  updateItem: updatePolicy,
  add: {
    // Request URL: https://ego.qa.overture.bio/api/policies/a73d7e7b-ea43-4919-8bc8-e1d22c14954f/permission/group/93ba5aba-5eba-4b6f-ae04-177fa8cbc8af
    groups: ({ group, item }) => addGroupPermissionToPolicy({ policy: item, group }),
    // Request URL: https://ego.qa.overture.bio/api/policies/a73d7e7b-ea43-4919-8bc8-e1d22c14954f/permission/user/e8848b32-cc2b-4113-9891-5de7f6abbbc9
    users: ({ user, item }) => addUserPermissionToPolicy({ policy: item, user }),
  },
  remove: {
    groups: ({ group, item }) => removeGroupPermissionFromPolicy({ policy: item, group }),
    users: ({ user, item }) => removeUserPermissionFromPolicy({ policy: item, user }),
  },
};

export default PolicyResource;

// TO REMOVE:
// rowHeight: 44,
// name: { singular: POLICY, plural: POLICIES },
// getName: (item) => get(item, 'name'),
// Icon: ({ style }) => <PolicyIcon style={style} />,
// initialSortOrder: 'ASC',
// isParent: true,
// ListItem: PolicyListItem,
// getKey: (item) => item.id.toString(),
// addItem: false,
// associatedTypes: [GROUPS, USERS],
// AssociatorComponent: PermissionsTable,
// emptyMessage: 'Please select a policy',
// getListAll: getPolicies,
