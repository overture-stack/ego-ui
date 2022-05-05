import { IListParams, IListResponse } from 'common/typedefs/Resource';
import { getGroupPermissions, getUserAndUserGroupPermissions, getPolicies } from 'services';

interface PermissionResourceInterface {
  getList: {
    groups: (params: IListParams) => Promise<IListResponse>;
    users: (params: IListParams) => Promise<IListResponse>;
  };
  getListAll: (params: IListParams) => Promise<IListResponse>;
}

const PermissionResource: PermissionResourceInterface = {
  getList: {
    groups: getGroupPermissions,
    users: getUserAndUserGroupPermissions,
  },
  // TODO: rename
  getListAll: getPolicies,
};

export default PermissionResource;

// TO REMOVE
// initialSortOrder: 'ASC',
// rowHeight: 44,
// getName: (item) => get(item, 'name'),
// Icon: () => null,
// isParent: false,
// ListItem: PermissionListItem,
// name: { singular: PERMISSION, plural: PERMISSIONS },
// emptyMessage: '',
// associatedTypes: [],
// AssociatorComponent: {
//   groups: PermissionsTable,
//   users: UserPermissionsTable,
// },
// getKey: (item) => item.id.toString(),
// addItem: {
//   groups: true,
//   users: false,
// },
