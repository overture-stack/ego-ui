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

export type TResourceType =
  | 'groups'
  | 'applications'
  | 'users'
  | 'API Keys'
  | 'permissions'
  | 'policies';

export type TSortDirection = 'DESC' | 'ASC';

interface IListParams {
  offset?: number = null;
  limit?: number = null;
  query?: any = null;
  sortField?: any = null;
  sortOrder?: any = null;
  applicationId?: any = null;
  groupId?: any = null;
  userId?: any = null;
  status?: any = null;
}

interface IListResponse {
  limit: number;
  offset: number;
  count: number;
  resultSet: User[] | Group[] | Application[] | Policy[] | UserPermission[] | ApiKey[];
}

type TGetItem = (id: string) => Promise<User | Group | Application>;

interface ICreateGroup {
  item: { name: string; status: string; description?: string };
}

interface ICreateUser {
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

interface ICreateApplication {
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

interface ICreatePermission {
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
  // groups: (group: Group, item: User) => Promise<any>;
  // permissions: (permission: UserPermission, item: User) => Promise<any>;
}

interface IAddToGroup {
  applications: (application: Application, item: ICreateApplication) => Promise<any>;
  users: (user: User, item: ICreateUser) => Promise<any>;
}

interface IAddToApplication {
  groups: (group: Group, item: ICreateGroup) => Promise<any>;
  users: (user: User, item: ICreateUser) => Promise<any>;
}

export interface IResource {
  Icon: any;
  getName: (params: User | Policy | Group | Application | Permission | ApiKey) => string;
  emptyMessage: string;
  schema: Schema;
  noDelete?: true;
  name: { singular: string; plural: TResourceType };
  ListItem: JSX.Element<any>;
  getList: (params: IListParams) => Promise<IListResponse>;
  getListAll: (params: IListParams) => Promise<IListResponse>;
  getItem?: TGetItem;
  updateItem?: (
    item: ICreateUser | ICreateGroup | ICreateApplication,
  ) => Promise<User | Group | Application>;
  createItem?: (
    item: ICreateUser | ICreateGroup | ICreateApplication,
  ) => Promise<User | Group | Application>;
  deleteItem?: (item: ICreateUser | ICreateGroup | ICreateApplication) => Promise<null | string>;
  rowHeight: number;
  initialSortOrder: SortDirection;
  associatedTypes: Types[];
  initialSortField: (any) => string;
  childSchema?: Schema;
  addItem: boolean;
  add?: IAddToUser | IAddToGroup | IAddToApplication | any;
  remove?: any;
  getKey: Function;
  mapTableData: Function;
  // add: { [key in TResourceType]?: (params: any) => Promise<any> };
  // remove: { [key in TResourceType]?: (params: any) => Promise<any> };
  sortableFields: Schema;
  isParent: boolean;
  AssociatorComponent?: JSX.Element<{ associatedItems: any[] }> | null;
}
