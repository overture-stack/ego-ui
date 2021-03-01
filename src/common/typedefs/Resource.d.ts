import { API_KEYS, APPLICATIONS, GROUPS, PERMISSIONS, POLICIES, USERS } from 'common/enums';
import { ApiKey } from 'common/typedefs/ApiKey';
import { Application } from 'common/typedefs/Application';
import { Group } from 'common/typedefs/Group';
import { Policy } from 'common/typedefs/Policy';
import { User } from 'common/typedefs/User';
import { TMaskLevel, UserPermission } from 'common/typedefs/UserPermission';

export type TFieldType = 'dropdown' | 'text';

export interface IField {
  key: string;
  fieldName: string;
  sortable?: boolean;
  initialSort?: boolean;
  fieldType?: FieldType;
  options?: string[];
  required?: boolean;
  immutable?: boolean;
  fieldContent?: any;
}

export type ISchema = IField[];

export type TResourceType = GROUPS | APPLICATIONS | USERS | API_KEYS | PERMISSIONS | POLICIES;

export type TSortDirection = 'DESC' | 'ASC';

interface IBaseListParams {
  offset?: number = null;
  limit?: number = null;
  query?: any = null;
  sortField?: any = null;
  sortOrder?: any = null;
}

interface IListParams extends IBaseListParams {
  applicationId?: any = null;
  groupId?: any = null;
  userId?: any = null;
  status?: any = null;
}

interface IGroupPermissionParams extends IBaseListParams {
  groupId: string;
}

interface IUserPermissionParams extends IBaseListParams {
  userId: string;
}

interface IListResponse {
  limit: number;
  offset: number;
  count: number;
  resultSet: User[] | Group[] | Application[] | Policy[] | UserPermission[] | ApiKey[];
}

type TGetItem = (id: string) => Promise<User | Group | Application | string>;

interface GroupInterface {
  item: { name: string; status: string; description?: string };
}

interface UserInterface {
  item: {
    userName: string;
    email: string;
    type: string;
    status: string;
    firstName: string;
    lastName: string;
    preferredLanguage?: string;
  };
}

interface ApplicationInterface {
  item: {
    name: string;
    description: string;
    status: string;
    type: string;
    clientId?: string;
    redirectUri?: string;
  };
}

interface TAddEntity {
  users?: any;
  groups?: any;
  applications?: any;
  permissions?: any;
}

interface PermissionInterface {
  accessLevel: TMaskLevel;
  owner: User;
  policy: {
    name: string;
    id: string;
  };
}

// TODO: proper typing for add/remove.
interface IAddToUser {
  applications: (
    application: Application,
    item: User,
  ) => (user: { item: User }, application: any) => Promise<User>;
  groups: (group: Group, item: User) => Promise<any>;
  permissions: (permission: UserPermission, item: User) => Promise<any>;
}

interface IAddToGroup {
  applications: (application: Application, item: ApplicationInterface) => Promise<any>;
  users: (user: User, item: UserInterface) => Promise<any>;
  permissions: (permission: Permission, item: GroupInterface) => Promise<any>;
}

interface IAddToApplication {
  groups: (group: Group, item: GroupInterface) => Promise<any>;
  users: (user: User, item: UserInterface) => Promise<any>;
}

interface IPermissionsGetList {
  groups: (params: IGroupPermissionParams) => Promise<IListResponse>;
  users: (params: IUserPermissionParams) => Promise<IListResponse>;
}

type TGetList = (params: IListParams) => Promise<IListResponse>;

export interface IResource {
  Icon: any;
  getName: (params: User | Policy | Group | Application | Permission | ApiKey) => string;
  emptyMessage: string;
  schema: Schema;
  noDelete?: true;
  name: { singular: string; plural: TResourceType };
  ListItem: JSX.Element<any>;
  getList: TGetList | IPermissionsGetList;
  getListAll: (params: IListParams) => Promise<IListResponse>;
  getItem?: TGetItem | undefined;
  updateItem?: (
    item: UserInterface | GroupInterface | ApplicationInterface,
  ) => Promise<User | Group | Application>;
  createItem?: (item: GroupInterface | ApplicationInterface) => Promise<Group | Application>;
  deleteItem?: (
    item: UserInterface | GroupInterface | ApplicationInterface,
  ) => Promise<null | string>;
  rowHeight: number;
  initialSortOrder: SortDirection;
  associatedTypes: Types[];
  initialSortField: (any) => string;
  childSchema?: Schema;
  addItem: boolean | { groups: boolean; users: boolean };
  add?: IAddToUser | IAddToGroup | IAddToApplication | any;
  remove?: any;
  getKey: Function;
  mapTableData: Function;
  // remove: { [key in TResourceType]?: (params: any) => Promise<any> };
  sortableFields: Schema;
  isParent: boolean;
  AssociatorComponent?: JSX.Element<{ associatedItems: any[] }> | null;
}
