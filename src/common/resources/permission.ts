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
